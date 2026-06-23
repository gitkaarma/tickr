package com.tickr.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.tickr.config.TickrProperties;
import com.tickr.model.LiveQuote;
import com.tickr.model.NewsItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Finnhub adapter for company news and fundamental enrichment (market cap, P/E, logo).
 * <p>
 * All calls are best-effort: news and fundamentals are secondary to the core quote/chart, so
 * any failure (no key, rate limit, downtime) degrades gracefully to empty/null rather than
 * failing the request. If no API key is configured the provider is simply disabled.
 */
@Component
public class FinnhubProvider {

    private static final Logger log = LoggerFactory.getLogger(FinnhubProvider.class);
    private static final int MAX_NEWS = 12;
    private static final int NEWS_LOOKBACK_DAYS = 21;

    private final RestClient client;
    private final String token;
    private final boolean enabled;

    public FinnhubProvider(@Qualifier("finnhubClient") RestClient client, TickrProperties props) {
        this.client = client;
        this.token = props.providers().finnhub().apiKey();
        this.enabled = token != null && !token.isBlank();
    }

    public boolean isEnabled() {
        return enabled;
    }

    /** Market cap, P/E, logo and industry. Returns {@link CompanyFundamentals#empty()} on any failure. */
    public CompanyFundamentals fundamentals(String symbol) {
        if (!enabled) {
            return CompanyFundamentals.empty();
        }
        Double marketCap = null;
        String logo = null;
        String industry = null;
        JsonNode profile = safeGet(b -> b.path("/stock/profile2")
                .queryParam("symbol", symbol).queryParam("token", token).build());
        if (profile != null) {
            Double capMillions = optDbl(profile, "marketCapitalization");
            marketCap = capMillions == null ? null : capMillions * 1_000_000d; // Finnhub reports millions
            logo = str(profile, "logo");
            industry = str(profile, "finnhubIndustry");
        }

        Double pe = null;
        JsonNode metrics = safeGet(b -> b.path("/stock/metric")
                .queryParam("symbol", symbol).queryParam("metric", "all").queryParam("token", token).build());
        if (metrics != null) {
            JsonNode m = metrics.path("metric");
            pe = firstNonNull(optDbl(m, "peTTM"), optDbl(m, "peBasicExclExtraTTM"), optDbl(m, "peNormalizedAnnual"));
        }
        return new CompanyFundamentals(marketCap, pe, logo, industry);
    }

    /** Recent company news. Returns an empty list on any failure. */
    public List<NewsItem> companyNews(String symbol) {
        if (!enabled) {
            return List.of();
        }
        LocalDate to = LocalDate.now();
        LocalDate from = to.minusDays(NEWS_LOOKBACK_DAYS);
        JsonNode arr = safeGet(b -> b.path("/company-news")
                .queryParam("symbol", symbol)
                .queryParam("from", from.toString())
                .queryParam("to", to.toString())
                .queryParam("token", token)
                .build());
        return mapArticles(arr);
    }

    /** Top general market news (not symbol-specific). Returns an empty list on any failure. */
    public List<NewsItem> marketNews() {
        if (!enabled) {
            return List.of();
        }
        JsonNode arr = safeGet(b -> b.path("/news")
                .queryParam("category", "general")
                .queryParam("token", token)
                .build());
        return mapArticles(arr);
    }

    private static List<NewsItem> mapArticles(JsonNode arr) {
        if (arr == null || !arr.isArray()) {
            return List.of();
        }
        List<NewsItem> out = new ArrayList<>();
        for (JsonNode n : arr) {
            String headline = str(n, "headline");
            if (headline == null || headline.isBlank()) {
                continue;
            }
            out.add(new NewsItem(
                    headline,
                    str(n, "summary"),
                    str(n, "source"),
                    str(n, "url"),
                    str(n, "image"),
                    n.path("datetime").asLong(0),
                    str(n, "category")));
            if (out.size() >= MAX_NEWS) {
                break;
            }
        }
        return out;
    }

    /** Lightweight real-time quote (price + change). Returns null when unavailable. */
    public LiveQuote quote(String symbol) {
        if (!enabled) {
            return null;
        }
        JsonNode q = safeGet(b -> b.path("/quote")
                .queryParam("symbol", symbol).queryParam("token", token).build());
        if (q == null) {
            return null;
        }
        double price = q.path("c").asDouble(0);
        if (price == 0d) {
            return null; // Finnhub returns c=0 for unknown symbols / no data
        }
        return new LiveQuote(symbol.toUpperCase(), price, q.path("d").asDouble(0), q.path("dp").asDouble(0));
    }

    /** Live quotes for several symbols (sequential to respect the per-second limit). Missing are omitted. */
    public Map<String, LiveQuote> quotes(List<String> symbols) {
        Map<String, LiveQuote> out = new LinkedHashMap<>();
        for (String s : symbols) {
            LiveQuote q = quote(s);
            if (q != null) {
                out.put(q.symbol(), q);
            }
        }
        return out;
    }

    // --- helpers ---------------------------------------------------------------

    private JsonNode safeGet(Function<UriBuilder, URI> uriFn) {
        try {
            return client.get().uri(uriFn).retrieve().body(JsonNode.class);
        } catch (Exception e) {
            log.debug("Finnhub call failed (degrading gracefully): {}", e.getMessage());
            return null;
        }
    }

    private static String str(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }

    private static Double optDbl(JsonNode n, String field) {
        JsonNode v = n.get(field);
        if (v == null || v.isNull() || !v.isNumber() && v.asText().isBlank()) {
            return null;
        }
        double d = v.asDouble();
        return d == 0.0 ? null : d;
    }

    @SafeVarargs
    private static <T> T firstNonNull(T... values) {
        for (T v : values) {
            if (v != null) {
                return v;
            }
        }
        return null;
    }
}
