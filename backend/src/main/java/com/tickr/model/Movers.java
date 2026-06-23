package com.tickr.model;

import java.util.List;

/** Top movers across a curated universe, split into gainers and losers. */
public record Movers(
        List<MoverItem> gainers,
        List<MoverItem> losers) {
}
