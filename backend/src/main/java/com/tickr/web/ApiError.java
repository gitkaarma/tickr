package com.tickr.web;

/**
 * Uniform error body returned to the frontend.
 *
 * @param error     short machine-readable code, e.g. "rate_limited"
 * @param message   human-readable explanation
 * @param retryable whether the client can reasonably retry shortly
 */
public record ApiError(String error, String message, boolean retryable) {
}
