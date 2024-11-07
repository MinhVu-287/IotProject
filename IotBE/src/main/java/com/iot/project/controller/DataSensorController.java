package com.iot.project.controller;

import com.iot.project.consant.ConstantValue;
import com.iot.project.dto.ApiResponse;
import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.dto.response.PagedResponse;
import com.iot.project.service.DataSensorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/data-sensors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataSensorController {
    DataSensorService dataSensorService;

    @GetMapping
    public ApiResponse<PagedResponse<DataSensorResponse>> getAllDataSensorsWithCondition(
            @RequestParam(defaultValue = ConstantValue.CURRENT_PAGE) int page,
            @RequestParam(defaultValue = ConstantValue.PAGE_SIZE) int size,
            @RequestParam(defaultValue = ConstantValue.SORT_STRATEGY) String[] sort,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc(sort[0])));
        return ApiResponse.<PagedResponse<DataSensorResponse>>builder()
                .message("successfully")
                .result(dataSensorService.getAllDataSensorsByCondition(pageRequest, search, startDate, endDate))
                .build();
    }

    @GetMapping("/latest")
    public ApiResponse<DataSensorResponse> getLatestDataSensor() {
        return ApiResponse.<DataSensorResponse>builder()
                .message("successfully")
                .result(dataSensorService.getLatestDataSensor())
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<DataSensorResponse>> getAllDataSensor() {
        return ApiResponse.<List<DataSensorResponse>>builder()
                .message("successfully")
                .result(dataSensorService.getAllDataSensors())
                .build();
    }
}
