package com.tickr.provider;

/** The requested symbol does not exist upstream (HTTP 404 / code 404). Not retried. */
public class SymbolNotFoundException extends MarketDataException {
    public SymbolNotFoundException(String symbol) {
        super("Symbol not found: " + symbol);
    }
}
