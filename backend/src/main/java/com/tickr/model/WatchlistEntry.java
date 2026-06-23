package com.tickr.model;

/** A watchlist row enriched with its live quote. {@code addedAt} is an ISO-8601 instant. */
public record WatchlistEntry(
        String symbol,
        String name,
        double price,
        double change,
        double changePercent,
        String addedAt) {
}
