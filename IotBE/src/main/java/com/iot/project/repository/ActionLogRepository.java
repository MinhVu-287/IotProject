package com.iot.project.repository;

import com.iot.project.dto.projection.ActionLogProjection;
import com.iot.project.entity.ActionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
    @Query("""
       SELECT a.id AS id,
              a.device AS device,
              a.action AS action,
              a.time AS time
       FROM ActionLog a
       WHERE (:search IS NULL OR a.device LIKE %:search% OR a.action LIKE %:search%)
       AND (:startDate IS NULL OR a.time >= :startDate)
       AND (:endDate IS NULL OR a.time <= :endDate)
       """)
    Page<ActionLogProjection> findActionsWithCondition(
            String search,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );

    @Query("SELECT a FROM ActionLog a ORDER BY a.time DESC LIMIT 1")
    ActionLog findLatestAction();
}
