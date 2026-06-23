package com.tickr.service;

import com.tickr.config.CacheConfig;
import com.tickr.model.NewsItem;
import com.tickr.provider.FinnhubProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsService {

    private final FinnhubProvider finnhub;

    public NewsService(FinnhubProvider finnhub) {
        this.finnhub = finnhub;
    }

    @Cacheable(cacheNames = CacheConfig.NEWS, key = "#symbol.toUpperCase()")
    public List<NewsItem> news(String symbol) {
        return finnhub.companyNews(symbol);
    }

    @Cacheable(cacheNames = CacheConfig.NEWS, key = "'market:general'")
    public List<NewsItem> marketNews() {
        return finnhub.marketNews();
    }
}
