package com.iot.project.service;

import com.iot.project.dto.response.DataSensorResponse;

public interface DataSensorService {
    DataSensorResponse getSensorById(Long id);
}
