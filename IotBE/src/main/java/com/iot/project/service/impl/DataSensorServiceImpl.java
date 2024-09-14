package com.iot.project.service.impl;

import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.entity.DataSensor;
import com.iot.project.exception.AppException;
import com.iot.project.repository.DataSensorRepository;
import com.iot.project.service.DataSensorService;
import com.iot.project.utils.ErrorCode;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataSensorServiceImpl implements DataSensorService {
    @Autowired
    private DataSensorRepository dataSensorRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public DataSensorResponse getSensorById(Long id) {
        DataSensor dataSensor = dataSensorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FIELD_NOT_EXIST));
        return modelMapper.map(dataSensor, DataSensorResponse.class);
    }
}
