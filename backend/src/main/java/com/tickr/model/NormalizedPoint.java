package com.tickr.model;

/** A single point in a normalized compare series: percent change from the range start. */
public record NormalizedPoint(
        String datetime,
        double value) {
}
