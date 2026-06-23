package com.tickr.model;

/** A single OHLC(V) data point in a price history series. */
public record Candle(
        String datetime,
        double open,
        double high,
        double low,
        double close,
        Long volume) {
}
