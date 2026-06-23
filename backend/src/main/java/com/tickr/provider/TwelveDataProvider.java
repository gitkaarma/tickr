package com.tickr.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.tickr.config.TickrProperties;
import com.tickr.model.Candle;
import com.tickr.model.PriceHistory;
import com.tickr.model.Quote;
import com.tickr.model.Range;
import com.tickr.model.SymbolMatch;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * {@link MarketDataProvider} backed by the Twelve Data REST API.
 * <p>
 * Twelve Data signals most failures with HTTP 200 and an error body
 * ({@code {"status":"error","code":...}}), so every response is inspected via
 * {@link #checkError}. Methods are wrapped with the {@code upstream} retry instance, which
 * retries only transient {@link UpstreamException}s (not 404s or rate limits).
 */
@Component
public class TwelveDataProvider implements MarketDataProvider {

    private final RestClient client;
    private final String apiKey;

    public TwelveDataProvider(@Qualifier("twelveDataClient") RestClient client, TickrProperties props) {
        this.client = client;
        this.apiKey = props.providers().twelvedata().apiKey();
    }

    @Override
    @Retry(name = "upstream")
    public List<SymbolMatch> search(String query) {
        JsonNode root = get(b -> b.path("/symbol_search")
                .queryParam("symbol", query)
                .queryParam("outputsize", 12)
                .queryParam("apikey", apiKey)
                .build());
        checkError(root, query);
        List<SymbolMatch> out = new ArrayList<>();
        for (JsonNode d : root.path("data")) {
            out.add(new SymbolMatch(
                    str(d, "symbol"),
                    str(d, "instrument_name"),
                    str(d, "exchange"),
                    str(d, "instrument_type"),
                    str(d, "currency"),
                    str(d, "country")));
        }
        return out;
    }

    @Override
    @Retry(name = "upstream")
    public Quote getQuote(String symbol) {
        JsonNode root = get(b -> b.path("/quote")
                .queryParam("symbol", symbol)
                .queryParam("apikey", apiKey)
                .build());
        checkError(root, symbol);
        return mapQuote(root, symbol);
    }

    @Override
    @Retry(name = "upstream")
    public Map<String, Quote> getQuotes(List<String> symbols) {
        JsonNode root = get(b -> b.path("/quote")
                .queryParam("symbol", String.join(",", symbols))
                .queryParam("apikey", apiKey)
                .build());
        // A top-level error means the whole batch failed (e.g. rate limit) -> surface it.
        checkError(root, symbols.isEmpty() ? null : symbols.get(0));

        Map<String, Quote> out = new LinkedHashMap<>();
        if (root.has("symbol")) {
            // Twelve Data returns a bare object when exactly one symbol is requested.
            Quote q = mapQuote(root, symbols.get(0));
            out.put(q.symbol(), q);
            return out;
        }
        root.fields().forEachRemaining(entry -> {
            JsonNode v = entry.getValue();
            if (isError(v)) {
                return; // skip an individual symbol that failed; keep the rest
            }
            out.put(entry.getKey(), mapQuote(v, entry.getKey()));
        });
        return out;
    }

    @Override
    @Retry(name = "upstream")
    public PriceHistory getHistory(String symbol, Range range) {
        JsonNode root = get(b -> b.path("/time_series")
                .queryParam("symbol", symbol)
                .queryParam("interval", range.interval())
                .queryParam("outputsize", range.outputSize())
                .queryParam("apikey", apiKey)
                .build());
        checkError(root, symbol);

        List<Candle> candles = new ArrayList<>();
        for (JsonNode v : root.path("values")) {
            candles.add(new Candle(
                    str(v, "datetime"),
                    dbl(v, "open"),
                    dbl(v, "high"),
                    dbl(v, "low"),
                    dbl(v, "close"),
                    optLong(v, "volume")));
        }
        // Twelve Data returns newest-first; charts want oldest-first.
        java.util.Collections.reverse(candles);
        return new PriceHistory(symbol.toUpperCase(), range.code(), range.interval(), candles);
    }

    // --- helpers ---------------------------------------------------------------

    private JsonNode get(Function<UriBuilder, URI> uriFn) {
        try {
            return client.get().uri(uriFn).retrieve().body(JsonNode.class);
        } catch (RestClientResponseException e) {
            int sc = e.getStatusCode().value();
            if (sc == 429) {
                throw new RateLimitException("Twelve Data rate limit (HTTP 429)");
            }
            throw new UpstreamException("Twelve Data returned HTTP " + sc, e);
        } catch (ResourceAccessException e) {
            throw new UpstreamException("Twelve Data unreachable or timed out", e);
        }
    }

    private static boolean isError(JsonNode node) {
        return node != null && node.has("status") && "error".equalsIgnoreCase(node.path("status").asText());
    }

    private void checkError(JsonNode node, String symbol) {
        if (node == null) {
            throw new UpstreamException("Empty response from Twelve Data");
        }
        if (isError(node)) {
            int code = node.path("code").asInt(0);
            String msg = node.path("message").asText("Upstream error");
            if (code == 404) {
                throw new SymbolNotFoundException(symbol != null ? symbol : msg);
            }
            if (code == 429) {
                throw new RateLimitException(msg);
            }
            throw new UpstreamException("Twelve Data error " + code + ": " + msg);
        }
    }

    private static Quote mapQuote(JsonNode q, String fallbackSymbol) {
        JsonNode fw = q.path("fifty_two_week");
        String symbol = str(q, "symbol");
        return new Quote(
                symbol != null ? symbol : fallbackSymbol,
                str(q, "name"),
                str(q, "exchange"),
                str(q, "currency"),
                dbl(q, "close"),
                dbl(q, "change"),
                dbl(q, "percent_change"),
                dbl(q, "open"),
                dbl(q, "high"),
                dbl(q, "low"),
                dbl(q, "previous_close"),
                optLong(q, "volume"),
                optDbl(fw, "high"),
                optDbl(fw, "low"),
                null,  // marketCap   (enriched from Finnhub)
                null,  // peRatio      (enriched from Finnhub)
                null,  // logoUrl      (enriched from Finnhub)
                q.path("is_market_open").asBoolean(false),
                str(q, "datetime"));
    }

    private static String str(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }

    private static double dbl(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return v == null || v.isNull() ? 0.0 : v.asDouble();
    }

    private static Double optDbl(JsonNode n, String field) {
        JsonNode v = n.get(field);
        if (v == null || v.isNull() || v.asText().isBlank()) {
            return null;
        }
        return v.asDouble();
    }

    private static Long optLong(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return v == null || v.isNull() ? null : v.asLong();
    }
}
