package com.tickr.web;

import com.tickr.model.PriceHistory;
import com.tickr.model.Quote;
import com.tickr.model.Range;
import com.tickr.service.MarketDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final MarketDataService service;

    public StockController(MarketDataService service) {
        this.service = service;
    }

    /** Snapshot quote + key stats for a symbol. */
    @GetMapping("/{symbol}/quote")
    public Quote quote(@PathVariable String symbol) {
        return service.getQuote(symbol);
    }

    /** Historical price series for charting. {@code range} is one of 1D, 1W, 1M, 3M, 1Y, 5Y. */
    @GetMapping("/{symbol}/history")
    public PriceHistory history(@PathVariable String symbol,
                                @RequestParam(name = "range", defaultValue = "1M") String range) {
        return service.getHistory(symbol, Range.fromCode(range));
    }
}
