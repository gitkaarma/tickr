package com.tickr.model;

/** A compact quote for the homepage market strip (indices / FX / crypto). */
public record MarketTicker(
        String symbol,
        String label,
        double price,
        double change,
        double changePercent,
        String currency) {
}
