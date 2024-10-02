package com.iot.project.repository;

import com.iot.project.dto.projection.ActionLogProjection;
import com.iot.project.dto.projection.DataSensorProjection;
import com.iot.project.dto.response.ActionLogResponse;
import com.iot.project.entity.ActionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
    @Query("""
       SELECT a.id AS id,
              a.device AS device,
              a.action AS action,
              a.time AS time
       FROM ActionLog a
       WHERE :search IS NULL
       OR a.device LIKE %:search%
       OR a.action LIKE %:search%
       """)
    Page<ActionLogProjection> findActionsWithCondition(String search, Pageable pageable);
}
