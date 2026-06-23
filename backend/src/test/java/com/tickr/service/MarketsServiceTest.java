package com.tickr.service;

import com.tickr.model.HeatmapCell;
import com.tickr.model.LiveQuote;
import com.tickr.model.MoverItem;
import com.tickr.model.Movers;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MarketsServiceTest {

    private final MarketDataService data = mock(MarketDataService.class);
    private final MarketsService markets = new MarketsService(data);

    @Test
    void heatmap_isSortedByChangeDescending() {
        when(data.liveQuotes(anyList())).thenReturn(Map.of(
                "XLK", new LiveQuote("XLK", 100, 1, 1.0),
                "XLF", new LiveQuote("XLF", 50, 2, 2.0),
                "XLE", new LiveQuote("XLE", 30, -1, -1.0)));

        List<HeatmapCell> cells = markets.heatmap();

        assertThat(cells).hasSize(3);
        assertThat(cells.get(0).symbol()).isEqualTo("XLF"); // strongest first
        assertThat(cells.get(0).changePercent())
                .isGreaterThanOrEqualTo(cells.get(cells.size() - 1).changePercent());
    }

    @Test
    void movers_splitsAndRanksGainersAndLosers() {
        Map<String, LiveQuote> quotes = new HashMap<>();
        quotes.put("AAPL", new LiveQuote("AAPL", 1, 1, 3.0));
        quotes.put("MSFT", new LiveQuote("MSFT", 1, 1, -2.0));
        quotes.put("NVDA", new LiveQuote("NVDA", 1, 1, 5.0));
        when(data.liveQuotes(anyList())).thenReturn(quotes);

        Movers movers = markets.movers();

        assertThat(movers.gainers().get(0).symbol()).isEqualTo("NVDA"); // biggest gain first
        assertThat(movers.gainers()).allMatch(m -> m.changePercent() > 0);
        assertThat(movers.losers()).extracting(MoverItem::symbol).contains("MSFT");
        assertThat(movers.losers()).allMatch(m -> m.changePercent() < 0);
    }
}
