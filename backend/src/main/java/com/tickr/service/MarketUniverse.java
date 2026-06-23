package com.tickr.service;

import java.util.List;
import java.util.Map;

/**
 * Curated symbol sets for the homepage. All are US-listed stocks/ETFs so they're covered by
 * Finnhub's free real-time quote endpoint. Kept modest so a cold homepage load stays within
 * the provider's per-minute limits.
 */
final class MarketUniverse {

    private MarketUniverse() {
    }

    /** Index strip: US majors plus international ETFs for a genuine "global" flavor. */
    static final List<String> INDEX_ORDER = List.of("SPY", "QQQ", "DIA", "IWM", "EFA", "EEM");

    static final Map<String, String> INDEX_LABELS = Map.of(
            "SPY", "S&P 500",
            "QQQ", "Nasdaq 100",
            "DIA", "Dow Jones",
            "IWM", "Russell 2000",
            "EFA", "Intl Developed",
            "EEM", "Emerging Mkts");

    /** The 11 SPDR sector ETFs, mapped to sector names, for the heatmap. */
    static final List<String> SECTOR_ORDER = List.of(
            "XLK", "XLF", "XLV", "XLY", "XLC", "XLI", "XLP", "XLE", "XLU", "XLB", "XLRE");

    static final Map<String, String> SECTOR_NAMES = Map.ofEntries(
            Map.entry("XLK", "Technology"),
            Map.entry("XLF", "Financials"),
            Map.entry("XLV", "Health Care"),
            Map.entry("XLY", "Consumer Disc."),
            Map.entry("XLC", "Communication"),
            Map.entry("XLI", "Industrials"),
            Map.entry("XLP", "Consumer Staples"),
            Map.entry("XLE", "Energy"),
            Map.entry("XLU", "Utilities"),
            Map.entry("XLB", "Materials"),
            Map.entry("XLRE", "Real Estate"));

    /** Liquid, widely-followed US names used to compute top movers. */
    static final List<String> MOVERS_UNIVERSE = List.of(
            "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "AMD",
            "NFLX", "JPM", "V", "DIS", "XOM", "WMT", "BA", "KO");

    static final Map<String, String> MOVERS_NAMES = Map.ofEntries(
            Map.entry("AAPL", "Apple"),
            Map.entry("MSFT", "Microsoft"),
            Map.entry("NVDA", "NVIDIA"),
            Map.entry("AMZN", "Amazon"),
            Map.entry("GOOGL", "Alphabet"),
            Map.entry("META", "Meta Platforms"),
            Map.entry("TSLA", "Tesla"),
            Map.entry("AMD", "AMD"),
            Map.entry("NFLX", "Netflix"),
            Map.entry("JPM", "JPMorgan Chase"),
            Map.entry("V", "Visa"),
            Map.entry("DIS", "Disney"),
            Map.entry("XOM", "Exxon Mobil"),
            Map.entry("WMT", "Walmart"),
            Map.entry("BA", "Boeing"),
            Map.entry("KO", "Coca-Cola"));
}
