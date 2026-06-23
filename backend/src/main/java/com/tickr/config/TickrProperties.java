package com.tickr.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/** Strongly-typed binding of the {@code tickr.*} configuration tree. */
@ConfigurationProperties(prefix = "tickr")
public record TickrProperties(Cors cors, Http http, Providers providers) {

    public record Cors(List<String> allowedOrigins) {
    }

    public record Http(int connectTimeoutMs, int readTimeoutMs) {
    }

    public record Providers(Provider twelvedata, Provider finnhub) {
    }

    public record Provider(String baseUrl, String apiKey) {
    }
}
