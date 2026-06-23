package com.tickr.provider;

/**
 * A transient upstream failure (5xx, network error, timeout). Retryable: the
 * Resilience4j {@code upstream} retry instance is configured to retry on this type.
 */
public class UpstreamException extends MarketDataException {
    public UpstreamException(String message) {
        super(message);
    }

    public UpstreamException(String message, Throwable cause) {
        super(message, cause);
    }
}
