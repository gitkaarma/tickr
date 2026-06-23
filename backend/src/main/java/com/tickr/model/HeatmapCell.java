package com.tickr.model;

/** One sector tile in the market heatmap (a SPDR sector ETF and its day move). */
public record HeatmapCell(
        String symbol,
        String sector,
        double price,
        double changePercent) {
}
