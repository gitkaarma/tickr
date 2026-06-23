package com.tickr.model;

import java.util.Arrays;

/**
 * A chart time range, mapped to the Twelve Data {@code interval} and number of data points
 * ({@code outputSize}) needed to cover it.
 */
public enum Range {
    ONE_DAY("1D", "5min", 78),
    ONE_WEEK("1W", "30min", 130),
    ONE_MONTH("1M", "1day", 23),
    THREE_MONTH("3M", "1day", 66),
    SIX_MONTH("6M", "1day", 126),
    ONE_YEAR("1Y", "1day", 252),
    FIVE_YEAR("5Y", "1week", 260);

    private final String code;
    private final String interval;
    private final int outputSize;

    Range(String code, String interval, int outputSize) {
        this.code = code;
        this.interval = interval;
        this.outputSize = outputSize;
    }

    public String code() {
        return code;
    }

    public String interval() {
        return interval;
    }

    public int outputSize() {
        return outputSize;
    }

    /** Parse a user-supplied range code (case-insensitive), e.g. "1m" or "1Y". */
    public static Range fromCode(String code) {
        return Arrays.stream(values())
                .filter(r -> r.code.equalsIgnoreCase(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unknown range '" + code + "'. Valid: 1D, 1W, 1M, 3M, 6M, 1Y, 5Y"));
    }
}
