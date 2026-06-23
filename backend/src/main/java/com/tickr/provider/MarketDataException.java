package com.tickr.provider;

/** Base type for failures talking to an upstream market-data provider. */
public abstract class MarketDataException extends RuntimeException {
    protected MarketDataException(String message) {
        super(message);
    }

    protected MarketDataException(String message, Throwable cause) {
        super(message, cause);
    }
}
