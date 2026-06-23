package com.tickr.provider;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.tickr.config.TickrProperties;
import com.tickr.model.PriceHistory;
import com.tickr.model.Quote;
import com.tickr.model.Range;
import com.tickr.model.SymbolMatch;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.options;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TwelveDataProviderTest {

    private static WireMockServer wm;
    private TwelveDataProvider provider;

    @BeforeAll
    static void startServer() {
        wm = new WireMockServer(options().dynamicPort());
        wm.start();
    }

    @AfterAll
    static void stopServer() {
        wm.stop();
    }

    @BeforeEach
    void setUp() {
        wm.resetAll();
        RestClient client = RestClient.builder().baseUrl(wm.baseUrl()).build();
        TickrProperties props = new TickrProperties(
                new TickrProperties.Cors(List.of()),
                new TickrProperties.Http(2000, 2000),
                new TickrProperties.Providers(
                        new TickrProperties.Provider(wm.baseUrl(), "testkey"),
                        new TickrProperties.Provider("", "")));
        provider = new TwelveDataProvider(client, props);
    }

    @Test
    void search_mapsResults() {
        wm.stubFor(get(urlPathEqualTo("/symbol_search")).willReturn(okJson("""
                {"data":[
                  {"symbol":"AAPL","instrument_name":"Apple Inc","exchange":"NASDAQ",
                   "instrument_type":"Common Stock","currency":"USD","country":"United States"}
                ],"status":"ok"}""")));

        List<SymbolMatch> results = provider.search("apple");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).symbol()).isEqualTo("AAPL");
        assertThat(results.get(0).name()).isEqualTo("Apple Inc");
        assertThat(results.get(0).exchange()).isEqualTo("NASDAQ");
    }

    @Test
    void quote_mapsAllFields() {
        wm.stubFor(get(urlPathEqualTo("/quote")).willReturn(okJson("""
                {"symbol":"AAPL","name":"Apple Inc.","exchange":"NASDAQ","currency":"USD",
                 "open":"297.5","high":"302.4","low":"296.7","close":"297.0","previous_close":"298.0",
                 "volume":"40000000","change":"-1.0","percent_change":"-0.33","is_market_open":false,
                 "fifty_two_week":{"low":"198.9","high":"317.3"}}""")));

        Quote q = provider.getQuote("AAPL");

        assertThat(q.symbol()).isEqualTo("AAPL");
        assertThat(q.price()).isEqualTo(297.0);
        assertThat(q.changePercent()).isEqualTo(-0.33);
        assertThat(q.previousClose()).isEqualTo(298.0);
        assertThat(q.volume()).isEqualTo(40000000L);
        assertThat(q.fiftyTwoWeekHigh()).isEqualTo(317.3);
        assertThat(q.marketOpen()).isFalse();
    }

    @Test
    void quote_errorCode404_throwsSymbolNotFound() {
        wm.stubFor(get(urlPathEqualTo("/quote")).willReturn(okJson("""
                {"code":404,"message":"symbol not found","status":"error"}""")));

        assertThatThrownBy(() -> provider.getQuote("NOPE"))
                .isInstanceOf(SymbolNotFoundException.class);
    }

    @Test
    void quote_errorCode429_throwsRateLimit() {
        wm.stubFor(get(urlPathEqualTo("/quote")).willReturn(okJson("""
                {"code":429,"message":"API limit reached","status":"error"}""")));

        assertThatThrownBy(() -> provider.getQuote("AAPL"))
                .isInstanceOf(RateLimitException.class);
    }

    @Test
    void quote_http500_throwsUpstream() {
        wm.stubFor(get(urlPathEqualTo("/quote")).willReturn(aResponse().withStatus(500)));

        assertThatThrownBy(() -> provider.getQuote("AAPL"))
                .isInstanceOf(UpstreamException.class);
    }

    @Test
    void history_mapsAndReversesToOldestFirst() {
        wm.stubFor(get(urlPathEqualTo("/time_series")).willReturn(okJson("""
                {"meta":{"symbol":"AAPL","interval":"1day"},
                 "values":[
                   {"datetime":"2026-06-22","open":"2","high":"3","low":"1","close":"2.5","volume":"10"},
                   {"datetime":"2026-06-21","open":"1","high":"2","low":"0.5","close":"1.5","volume":"20"}
                 ],"status":"ok"}""")));

        PriceHistory history = provider.getHistory("AAPL", Range.ONE_MONTH);

        assertThat(history.candles()).hasSize(2);
        // Twelve Data returns newest-first; we expect oldest-first.
        assertThat(history.candles().get(0).datetime()).isEqualTo("2026-06-21");
        assertThat(history.candles().get(1).datetime()).isEqualTo("2026-06-22");
        assertThat(history.candles().get(1).close()).isEqualTo(2.5);
    }
}
