package com.tickr.domain;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class WatchlistRepositoryTest {

    @Autowired
    private WatchlistRepository repo;

    @Test
    void findByClient_returnsOnlyThatClient_newestFirst() {
        Instant now = Instant.now();
        repo.save(new WatchlistItem("c1", "AAPL", now));
        repo.save(new WatchlistItem("c1", "MSFT", now.plusSeconds(10)));
        repo.save(new WatchlistItem("c2", "TSLA", now));

        List<WatchlistItem> c1 = repo.findByClientIdOrderByCreatedAtDesc("c1");

        assertThat(c1).hasSize(2);
        assertThat(c1.get(0).getSymbol()).isEqualTo("MSFT"); // newest first
        assertThat(c1.get(1).getSymbol()).isEqualTo("AAPL");
    }

    @Test
    void existsAndDelete_workByClientAndSymbol() {
        repo.save(new WatchlistItem("c1", "AAPL", Instant.now()));

        assertThat(repo.existsByClientIdAndSymbol("c1", "AAPL")).isTrue();

        long deleted = repo.deleteByClientIdAndSymbol("c1", "AAPL");

        assertThat(deleted).isEqualTo(1);
        assertThat(repo.existsByClientIdAndSymbol("c1", "AAPL")).isFalse();
    }
}
