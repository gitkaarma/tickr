package com.tickr.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;

/** A symbol saved to an anonymous client's watchlist. Identity is the browser-generated client id. */
@Entity
@Table(
        name = "watchlist_item",
        uniqueConstraints = @UniqueConstraint(name = "uq_client_symbol", columnNames = {"client_id", "symbol"}),
        indexes = @Index(name = "idx_client_id", columnList = "client_id"))
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id", nullable = false, length = 64)
    private String clientId;

    @Column(nullable = false, length = 24)
    private String symbol;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected WatchlistItem() {
        // for JPA
    }

    public WatchlistItem(String clientId, String symbol, Instant createdAt) {
        this.clientId = clientId;
        this.symbol = symbol;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getClientId() {
        return clientId;
    }

    public String getSymbol() {
        return symbol;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
