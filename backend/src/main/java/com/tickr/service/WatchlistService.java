package com.tickr.service;

import com.tickr.domain.WatchlistItem;
import com.tickr.domain.WatchlistRepository;
import com.tickr.model.LiveQuote;
import com.tickr.model.WatchlistEntry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Manages a browser-anonymous watchlist, enriching entries with live quotes on read. */
@Service
public class WatchlistService {

    private final WatchlistRepository repo;
    private final MarketDataService data;

    public WatchlistService(WatchlistRepository repo, MarketDataService data) {
        this.repo = repo;
        this.data = data;
    }

    @Transactional
    public void add(String clientId, String symbol) {
        String sym = normalize(symbol);
        if (!repo.existsByClientIdAndSymbol(clientId, sym)) {
            repo.save(new WatchlistItem(clientId, sym, Instant.now()));
        }
    }

    @Transactional
    public void remove(String clientId, String symbol) {
        repo.deleteByClientIdAndSymbol(clientId, normalize(symbol));
    }

    @Transactional(readOnly = true)
    public List<WatchlistEntry> list(String clientId) {
        List<WatchlistItem> items = repo.findByClientIdOrderByCreatedAtDesc(clientId);
        if (items.isEmpty()) {
            return List.of();
        }
        List<String> symbols = items.stream().map(WatchlistItem::getSymbol).toList();
        Map<String, LiveQuote> quotes = data.liveQuotes(symbols);

        List<WatchlistEntry> out = new ArrayList<>();
        for (WatchlistItem item : items) {
            LiveQuote q = quotes.get(item.getSymbol());
            out.add(new WatchlistEntry(
                    item.getSymbol(),
                    item.getSymbol(),
                    q != null ? q.price() : 0.0,
                    q != null ? q.change() : 0.0,
                    q != null ? q.changePercent() : 0.0,
                    item.getCreatedAt().toString()));
        }
        return out;
    }

    private static String normalize(String symbol) {
        if (symbol == null || symbol.isBlank()) {
            throw new IllegalArgumentException("symbol is required");
        }
        return symbol.trim().toUpperCase();
    }
}
