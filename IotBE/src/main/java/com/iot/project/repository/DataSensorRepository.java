package com.iot.project.repository;

import com.iot.project.dto.projection.DataSensorProjection;
import com.iot.project.entity.DataSensor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DataSensorRepository extends JpaRepository<DataSensor, Long> {
    @Query("""
       SELECT d.id AS id,
              d.temperature AS temperature,
              d.humidity AS humidity,
              d.light AS light,
              d.time AS time
       FROM DataSensor d
       WHERE :search IS NULL
       OR d.temperature LIKE %:search%
       OR d.humidity LIKE %:search%
       OR d.light LIKE %:search%
       """)
    Page<DataSensorProjection> findDataSensorsWithCondition(String search, Pageable pageable);

    @Query("SELECT d FROM DataSensor d ORDER BY d.time DESC LIMIT 1")
    DataSensor findLatestDataSensor();

    @Query("SELECT d "+
            "FROM DataSensor d " +
            "ORDER BY d.time DESC " +
            "LIMIT 5")
    List<DataSensor> findAllLimit();
}
