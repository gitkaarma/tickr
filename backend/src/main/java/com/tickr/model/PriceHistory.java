package com.tickr.model;

import java.util.List;

/** Ordered (oldest to newest) price history for a symbol over a given range. */
public record PriceHistory(
        String symbol,
        String range,
        String interval,
        List<Candle> candles) {
}
