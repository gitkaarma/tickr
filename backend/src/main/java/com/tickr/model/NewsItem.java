package com.tickr.model;

/** A company news headline. {@code datetime} is epoch seconds (Finnhub's native format). */
public record NewsItem(
        String headline,
        String summary,
        String source,
        String url,
        String imageUrl,
        long datetime,
        String category) {
}
