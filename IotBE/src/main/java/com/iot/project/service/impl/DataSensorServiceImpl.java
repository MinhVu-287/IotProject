package com.iot.project.service.impl;

import com.iot.project.dto.projection.DataSensorProjection;
import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.dto.response.PagedResponse;
import com.iot.project.entity.DataSensor;
import com.iot.project.repository.DataSensorRepository;
import com.iot.project.service.DataSensorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataSensorServiceImpl implements DataSensorService {
    DataSensorRepository dataSensorRepository;
    ModelMapper modelMapper;

    @Override
    public PagedResponse<DataSensorResponse> getAllDataSensorsByCondition(Pageable pageable, String search, LocalDateTime startDate, LocalDateTime endDate) {
        Page<DataSensorProjection> Page = dataSensorRepository.findDataSensorsWithCondition(search, startDate, endDate, pageable);

        List<DataSensorResponse> content = Page.getContent().stream()
                .map(projection -> modelMapper.map(projection, DataSensorResponse.class))
                .collect(Collectors.toList());

        return PagedResponse.<DataSensorResponse>builder()
                .content(content)
                .pageNumber(Page.getNumber())
                .pageSize(Page.getSize())
                .totalElements(Page.getTotalElements())
                .totalPages(Page.getTotalPages())
                .last(Page.isLast())
                .sort(Page.getSort())
                .build();
    }

    @Override
    public DataSensorResponse getLatestDataSensor() {
        DataSensor dataSensor = dataSensorRepository.findLatestDataSensor();
        return modelMapper.map(dataSensor, DataSensorResponse.class);
    }

    @Override
    public List<DataSensorResponse> getAllDataSensors() {
        List<DataSensor> dataSensor = dataSensorRepository.findAllLimit();
        return dataSensor.stream().map(data -> modelMapper.map(data, DataSensorResponse.class))
                .collect(Collectors.toList());
    }

}
