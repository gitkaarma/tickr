package com.tickr.provider;

/** Fundamental enrichment fetched from Finnhub. Any field may be null. */
public record CompanyFundamentals(Double marketCap, Double peRatio, String logoUrl, String industry) {

    public static CompanyFundamentals empty() {
        return new CompanyFundamentals(null, null, null, null);
    }
}
