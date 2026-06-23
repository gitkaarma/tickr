package com.tickr.model;

/** A lightweight real-time quote (price + change) used for the homepage strips and watchlist. */
public record LiveQuote(
        String symbol,
        double price,
        double change,
        double changePercent) {
}
