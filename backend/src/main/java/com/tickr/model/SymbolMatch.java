package com.tickr.model;

/** A single result from a symbol/company search. */
public record SymbolMatch(
        String symbol,
        String name,
        String exchange,
        String type,
        String currency,
        String country) {
}
