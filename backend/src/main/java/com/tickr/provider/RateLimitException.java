package com.tickr.provider;

/** The upstream provider returned a rate-limit response (HTTP 429 / code 429). Not retried. */
public class RateLimitException extends MarketDataException {
    public RateLimitException(String message) {
        super(message);
    }
}
