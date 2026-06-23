package com.tickr.config;

import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

/**
 * RestClient beans for each upstream provider, pre-configured with the provider base URL
 * and shared connect/read timeouts. The read timeout is our "request timeout" guard so a
 * slow upstream can't hang a request thread indefinitely.
 */
@Configuration
public class RestClientConfig {

    @Bean
    ClientHttpRequestFactory tickrRequestFactory(TickrProperties props) {
        ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.defaults()
                .withConnectTimeout(Duration.ofMillis(props.http().connectTimeoutMs()))
                .withReadTimeout(Duration.ofMillis(props.http().readTimeoutMs()));
        return ClientHttpRequestFactoryBuilder.detect().build(settings);
    }

    @Bean
    RestClient twelveDataClient(TickrProperties props, ClientHttpRequestFactory requestFactory) {
        return RestClient.builder()
                .baseUrl(props.providers().twelvedata().baseUrl())
                .requestFactory(requestFactory)
                .build();
    }

    @Bean
    RestClient finnhubClient(TickrProperties props, ClientHttpRequestFactory requestFactory) {
        return RestClient.builder()
                .baseUrl(props.providers().finnhub().baseUrl())
                .requestFactory(requestFactory)
                .build();
    }
}
