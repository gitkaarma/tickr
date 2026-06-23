package com.tickr.service;

import com.tickr.model.HeatmapCell;
import com.tickr.model.LiveQuote;
import com.tickr.model.MarketTicker;
import com.tickr.model.MoverItem;
import com.tickr.model.Movers;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/** Builds the homepage market views (index strip, sector heatmap, top movers) from live quotes. */
@Service
public class MarketsService {

    private static final int MOVERS_PER_SIDE = 6;

    private final MarketDataService data;

    public MarketsService(MarketDataService data) {
        this.data = data;
    }

    /** Index strip: US majors + international ETFs. */
    public List<MarketTicker> overview() {
        Map<String, LiveQuote> quotes = data.liveQuotes(MarketUniverse.INDEX_ORDER);
        List<MarketTicker> out = new ArrayList<>();
        for (String sym : MarketUniverse.INDEX_ORDER) {
            LiveQuote q = quotes.get(sym);
            if (q == null) {
                continue;
            }
            out.add(new MarketTicker(sym, MarketUniverse.INDEX_LABELS.get(sym),
                    q.price(), q.change(), q.changePercent(), "USD"));
        }
        return out;
    }

    /** Sector heatmap, strongest sector first. */
    public List<HeatmapCell> heatmap() {
        Map<String, LiveQuote> quotes = data.liveQuotes(MarketUniverse.SECTOR_ORDER);
        List<HeatmapCell> cells = new ArrayList<>();
        for (String sym : MarketUniverse.SECTOR_ORDER) {
            LiveQuote q = quotes.get(sym);
            if (q == null) {
                continue;
            }
            cells.add(new HeatmapCell(sym, MarketUniverse.SECTOR_NAMES.get(sym), q.price(), q.changePercent()));
        }
        cells.sort(Comparator.comparingDouble(HeatmapCell::changePercent).reversed());
        return cells;
    }

    /** Top gainers and losers across the curated universe. */
    public Movers movers() {
        Map<String, LiveQuote> quotes = data.liveQuotes(MarketUniverse.MOVERS_UNIVERSE);
        List<MoverItem> all = new ArrayList<>();
        for (String sym : MarketUniverse.MOVERS_UNIVERSE) {
            LiveQuote q = quotes.get(sym);
            if (q == null) {
                continue;
            }
            all.add(new MoverItem(sym, MarketUniverse.MOVERS_NAMES.getOrDefault(sym, sym),
                    q.price(), q.change(), q.changePercent()));
        }
        List<MoverItem> gainers = all.stream()
                .filter(m -> m.changePercent() > 0)
                .sorted(Comparator.comparingDouble(MoverItem::changePercent).reversed())
                .limit(MOVERS_PER_SIDE)
                .toList();
        List<MoverItem> losers = all.stream()
                .filter(m -> m.changePercent() < 0)
                .sorted(Comparator.comparingDouble(MoverItem::changePercent))
                .limit(MOVERS_PER_SIDE)
                .toList();
        return new Movers(gainers, losers);
    }
}
