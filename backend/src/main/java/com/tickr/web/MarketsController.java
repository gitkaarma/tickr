package com.tickr.web;

import com.tickr.model.HeatmapCell;
import com.tickr.model.MarketTicker;
import com.tickr.model.Movers;
import com.tickr.model.NewsItem;
import com.tickr.service.MarketsService;
import com.tickr.service.NewsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
public class MarketsController {

    private final MarketsService markets;
    private final NewsService news;

    public MarketsController(MarketsService markets, NewsService news) {
        this.markets = markets;
        this.news = news;
    }

    /** Index strip for the homepage header. */
    @GetMapping("/overview")
    public List<MarketTicker> overview() {
        return markets.overview();
    }

    /** Sector heatmap tiles. */
    @GetMapping("/heatmap")
    public List<HeatmapCell> heatmap() {
        return markets.heatmap();
    }

    /** Top gainers and losers. */
    @GetMapping("/movers")
    public Movers movers() {
        return markets.movers();
    }

    /** Top general market news headlines. */
    @GetMapping("/news")
    public List<NewsItem> news() {
        return news.marketNews();
    }
}
