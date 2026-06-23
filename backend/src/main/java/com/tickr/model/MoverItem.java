package com.tickr.model;

/** A single top-gainer or top-loser row. */
public record MoverItem(
        String symbol,
        String name,
        double price,
        double change,
        double changePercent) {
}
