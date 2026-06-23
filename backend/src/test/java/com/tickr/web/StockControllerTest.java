package com.tickr.web;

import com.tickr.config.TickrProperties;
import com.tickr.model.Quote;
import com.tickr.provider.RateLimitException;
import com.tickr.provider.SymbolNotFoundException;
import com.tickr.service.MarketDataService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StockController.class)
@EnableConfigurationProperties(TickrProperties.class)
class StockControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private MarketDataService service;

    private static Quote sampleQuote() {
        return new Quote("AAPL", "Apple Inc.", "NASDAQ", "USD",
                297.0, -1.0, -0.33, 297.5, 302.0, 296.0, 298.0,
                40_000_000L, 317.0, 198.0, null, null, null, false, "2026-06-22");
    }

    @Test
    void quote_returnsOk() throws Exception {
        when(service.getQuote("AAPL")).thenReturn(sampleQuote());

        mvc.perform(get("/api/stocks/AAPL/quote"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.symbol").value("AAPL"))
                .andExpect(jsonPath("$.price").value(297.0));
    }

    @Test
    void quote_symbolNotFound_maps404() throws Exception {
        when(service.getQuote("NOPE")).thenThrow(new SymbolNotFoundException("NOPE"));

        mvc.perform(get("/api/stocks/NOPE/quote"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("symbol_not_found"));
    }

    @Test
    void quote_rateLimited_maps429() throws Exception {
        when(service.getQuote("AAPL")).thenThrow(new RateLimitException("limit"));

        mvc.perform(get("/api/stocks/AAPL/quote"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.error").value("rate_limited"))
                .andExpect(jsonPath("$.retryable").value(true));
    }

    @Test
    void history_invalidRange_maps400() throws Exception {
        mvc.perform(get("/api/stocks/AAPL/history?range=ZZ"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("bad_request"));
    }
}
