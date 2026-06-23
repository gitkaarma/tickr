package com.tickr.model;

import java.util.List;

/** Result of comparing several symbols over a range, each normalized to percent change. */
public record CompareResult(
        String range,
        List<CompareSeries> series) {
}
