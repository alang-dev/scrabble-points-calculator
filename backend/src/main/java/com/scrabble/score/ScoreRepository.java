package com.scrabble.score;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreRepository extends JpaRepository<Score, UUID> {
  
  @Query("SELECT s FROM Score s ORDER BY s.points DESC, s.createdAt ASC")
  List<Score> findTopScoresByPointsDesc(Pageable pageable);
}