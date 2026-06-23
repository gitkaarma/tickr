package com.tickr.web;

import com.tickr.model.CompareResult;
import com.tickr.model.Range;
import com.tickr.service.CompareService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class CompareController {

    private final CompareService compare;

    public CompareController(CompareService compare) {
        this.compare = compare;
    }

    /** Compare 2-4 symbols over a range, each normalized to percent change. */
    @GetMapping("/compare")
    public CompareResult compare(@RequestParam("symbols") String symbols,
                                 @RequestParam(name = "range", defaultValue = "1Y") String range) {
        List<String> list = Arrays.stream(symbols.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
        if (list.size() < 2 || list.size() > 4) {
            throw new IllegalArgumentException("Provide between 2 and 4 symbols to compare");
        }
        return compare.compare(list, Range.fromCode(range));
    }
}
