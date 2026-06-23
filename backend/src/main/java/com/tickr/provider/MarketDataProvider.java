package com.tickr.provider;

import com.tickr.model.PriceHistory;
import com.tickr.model.Quote;
import com.tickr.model.Range;
import com.tickr.model.SymbolMatch;

import java.util.List;
import java.util.Map;

/**
 * Abstraction over an upstream market-data source. Keeping this an interface lets the
 * rest of the app stay provider-agnostic (and makes the upstream trivially mockable in tests).
 */
public interface MarketDataProvider {

    /** Symbol / company-name search. */
    List<SymbolMatch> search(String query);

    /** Snapshot quote for a single symbol. */
    Quote getQuote(String symbol);

    /** Snapshot quotes for several symbols in one upstream call. Missing symbols are omitted. */
    Map<String, Quote> getQuotes(List<String> symbols);

    /** Ordered (oldest to newest) price history for a symbol over a range. */
    PriceHistory getHistory(String symbol, Range range);
}
