package com.tickr.web;

import com.tickr.model.WatchlistEntry;
import com.tickr.service.WatchlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Anonymous watchlist keyed by a browser-generated client id (sent as the {@code X-Client-Id}
 * header). No login required.
 */
@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService service;

    public WatchlistController(WatchlistService service) {
        this.service = service;
    }

    @GetMapping
    public List<WatchlistEntry> list(@RequestHeader("X-Client-Id") String clientId) {
        return service.list(clientId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void add(@RequestHeader("X-Client-Id") String clientId, @Valid @RequestBody WatchlistRequest request) {
        service.add(clientId, request.symbol());
    }

    @DeleteMapping("/{symbol}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@RequestHeader("X-Client-Id") String clientId, @PathVariable String symbol) {
        service.remove(clientId, symbol);
    }
}
