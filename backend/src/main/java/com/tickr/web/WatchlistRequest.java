package com.tickr.web;

import jakarta.validation.constraints.NotBlank;

/** Body for adding a symbol to the watchlist. */
public record WatchlistRequest(@NotBlank String symbol) {
}
