package com.iot.project.service;

import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.dto.response.PagedResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DataSensorService {

    PagedResponse<DataSensorResponse> getAllDataSensorsByCondition(Pageable pageable, String search, LocalDateTime startDate, LocalDateTime endDate);

    DataSensorResponse getLatestDataSensor();

    List<DataSensorResponse> getAllDataSensors();
}
