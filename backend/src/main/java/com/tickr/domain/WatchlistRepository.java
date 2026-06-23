package com.tickr.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {

    List<WatchlistItem> findByClientIdOrderByCreatedAtDesc(String clientId);

    boolean existsByClientIdAndSymbol(String clientId, String symbol);

    long deleteByClientIdAndSymbol(String clientId, String symbol);
}
