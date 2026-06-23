package com.tickr.web;

import com.tickr.model.SymbolMatch;
import com.tickr.service.MarketDataService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@Validated
public class SearchController {

    private final MarketDataService service;

    public SearchController(MarketDataService service) {
        this.service = service;
    }

    /** Symbol / company-name search for the autocomplete box. */
    @GetMapping("/search")
    public List<SymbolMatch> search(@RequestParam("q") @NotBlank String q) {
        return service.search(q);
    }
}
