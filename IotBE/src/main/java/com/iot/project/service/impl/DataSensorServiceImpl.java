package com.iot.project.service.impl;

import com.iot.project.repository.DataSensorRepository;
import com.iot.project.service.DataSensorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataSensorServiceImpl implements DataSensorService {
    DataSensorRepository dataSensorRepository;
}
