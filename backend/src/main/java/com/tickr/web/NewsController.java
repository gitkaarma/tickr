package com.tickr.web;

import com.tickr.model.NewsItem;
import com.tickr.service.NewsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class NewsController {

    private final NewsService news;

    public NewsController(NewsService news) {
        this.news = news;
    }

    /** Recent company news for a symbol (empty if no news provider is configured). */
    @GetMapping("/{symbol}/news")
    public List<NewsItem> news(@PathVariable String symbol) {
        return news.news(symbol);
    }
}
