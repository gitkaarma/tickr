package com.tickr.model;

import java.util.List;

/** One symbol's normalized (% change) series for the compare chart. */
public record CompareSeries(
        String symbol,
        List<NormalizedPoint> points) {
}
