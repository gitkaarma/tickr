package com.tickr.model;

/**
 * A snapshot quote for a symbol. Price/OHLC/52-week come from Twelve Data;
 * {@code marketCap}, {@code peRatio} and {@code logoUrl} are enriched from Finnhub
 * and may be null when unavailable.
 */
public record Quote(
        String symbol,
        String name,
        String exchange,
        String currency,
        double price,
        double change,
        double changePercent,
        double open,
        double high,
        double low,
        double previousClose,
        Long volume,
        Double fiftyTwoWeekHigh,
        Double fiftyTwoWeekLow,
        Double marketCap,
        Double peRatio,
        String logoUrl,
        boolean marketOpen,
        String asOf) {

    /** Return a copy with Finnhub-sourced fundamentals filled in (keeps existing logo if none supplied). */
    public Quote withEnrichment(Double marketCap, Double peRatio, String logoUrl) {
        return new Quote(symbol, name, exchange, currency, price, change, changePercent,
                open, high, low, previousClose, volume, fiftyTwoWeekHigh, fiftyTwoWeekLow,
                marketCap, peRatio, logoUrl != null ? logoUrl : this.logoUrl, marketOpen, asOf);
    }
}
