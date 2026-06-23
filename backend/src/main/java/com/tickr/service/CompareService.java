package com.tickr.service;

import com.tickr.model.Candle;
import com.tickr.model.CompareResult;
import com.tickr.model.CompareSeries;
import com.tickr.model.NormalizedPoint;
import com.tickr.model.PriceHistory;
import com.tickr.model.Range;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/** Compares several symbols over a range, normalizing each to percent change from the start. */
@Service
public class CompareService {

    private final MarketDataService data;

    public CompareService(MarketDataService data) {
        this.data = data;
    }

    public CompareResult compare(List<String> symbols, Range range) {
        List<CompareSeries> series = new ArrayList<>();
        for (String symbol : symbols) {
            PriceHistory history = data.getHistory(symbol, range);
            series.add(new CompareSeries(symbol.toUpperCase(), normalize(history.candles())));
        }
        return new CompareResult(range.code(), series);
    }

    private static List<NormalizedPoint> normalize(List<Candle> candles) {
        List<NormalizedPoint> points = new ArrayList<>();
        if (candles.isEmpty()) {
            return points;
        }
        double base = candles.get(0).close();
        if (base == 0.0) {
            base = 1.0;
        }
        for (Candle c : candles) {
            double pct = (c.close() / base - 1.0) * 100.0;
            points.add(new NormalizedPoint(c.datetime(), Math.round(pct * 100.0) / 100.0));
        }
        return points;
    }
}
