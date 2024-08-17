package com.iot.project.repository;

import com.iot.project.entity.DataSensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataSensorRepository extends JpaRepository<DataSensor, Long> {
}
