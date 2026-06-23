package com.tickr.service;

import com.tickr.config.CacheConfig;
import com.tickr.model.LiveQuote;
import com.tickr.model.PriceHistory;
import com.tickr.model.Quote;
import com.tickr.model.Range;
import com.tickr.model.SymbolMatch;
import com.tickr.provider.CompanyFundamentals;
import com.tickr.provider.FinnhubProvider;
import com.tickr.provider.MarketDataProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Application-facing market-data API. Every method is cached so a burst of frontend requests
 * collapses into very few upstream calls (keeping us well under the free-tier limits).
 */
@Service
public class MarketDataService {

    private final MarketDataProvider provider;
    private final FinnhubProvider finnhub;

    public MarketDataService(MarketDataProvider provider, FinnhubProvider finnhub) {
        this.provider = provider;
        this.finnhub = finnhub;
    }

    @Cacheable(cacheNames = CacheConfig.SEARCH, key = "#query.trim().toLowerCase()")
    public List<SymbolMatch> search(String query) {
        return provider.search(query);
    }

    /** Single-symbol quote, enriched with Finnhub fundamentals (market cap, P/E, logo). */
    @Cacheable(cacheNames = CacheConfig.QUOTE, key = "#symbol.toUpperCase()")
    public Quote getQuote(String symbol) {
        Quote quote = provider.getQuote(symbol);
        CompanyFundamentals f = finnhub.fundamentals(symbol);
        return quote.withEnrichment(f.marketCap(), f.peRatio(), f.logoUrl());
    }

    /** Live quotes (via Finnhub, 60/min) for the homepage strips, heatmap, movers and watchlist. */
    @Cacheable(cacheNames = CacheConfig.MARKETS, key = "'live:' + #symbols")
    public Map<String, LiveQuote> liveQuotes(List<String> symbols) {
        return finnhub.quotes(symbols);
    }

    @Cacheable(cacheNames = CacheConfig.HISTORY, key = "#symbol.toUpperCase() + ':' + #range.code()")
    public PriceHistory getHistory(String symbol, Range range) {
        return provider.getHistory(symbol, range);
    }
}
