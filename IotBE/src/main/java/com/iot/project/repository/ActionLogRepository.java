package com.iot.project.repository;

import com.iot.project.dto.projection.ActionLogProjection;
import com.iot.project.entity.ActionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
    @Query("SELECT a FROM ActionLog a WHERE " +
            "(a.device LIKE %:search% OR a.action LIKE %:search%) " +
            "AND (:startDate IS NULL OR a.time >= :startDate) " +
            "AND (:endDate IS NULL OR a.time <= :endDate)")
    Page<ActionLogProjection> findActionsWithCondition(
            @Param("search") String search,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

}
