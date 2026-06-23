package com.tickr.config;

import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;

/**
 * Cache names and their TTLs.
 * <p>
 * Locally (profile {@code local}, {@code spring.cache.type=simple}) caches are unbounded
 * in-memory maps and these TTLs are ignored. In production (profile {@code prod},
 * {@code spring.cache.type=redis}) the customizer below applies per-cache TTLs to the
 * Redis-backed cache manager, with JSON-serialized values.
 */
@Configuration
public class CacheConfig {

    public static final String QUOTE = "quote";
    public static final String SEARCH = "search";
    public static final String HISTORY = "history";
    public static final String NEWS = "news";
    public static final String PROFILE = "profile";
    public static final String MARKETS = "markets";

    @Bean
    RedisCacheManagerBuilderCustomizer tickrCacheCustomizer() {
        RedisCacheConfiguration base = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        return builder -> builder
                .withCacheConfiguration(QUOTE, base.entryTtl(Duration.ofSeconds(60)))
                .withCacheConfiguration(SEARCH, base.entryTtl(Duration.ofHours(1)))
                .withCacheConfiguration(HISTORY, base.entryTtl(Duration.ofHours(6)))
                .withCacheConfiguration(NEWS, base.entryTtl(Duration.ofMinutes(15)))
                .withCacheConfiguration(PROFILE, base.entryTtl(Duration.ofHours(24)))
                .withCacheConfiguration(MARKETS, base.entryTtl(Duration.ofSeconds(60)));
    }
}
