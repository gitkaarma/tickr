package com.tickr.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI tickrOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Tickr API")
                .version("v1")
                .description("Backend-for-frontend for the Tickr global equity & ETF tracker. "
                        + "Proxies Twelve Data and Finnhub, caches responses, and persists the watchlist."));
    }
}
