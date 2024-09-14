package com.iot.project.controller;

import com.iot.project.dto.ApiResponse;
import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.service.DataSensorService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DataSensorController {
    DataSensorService dataSensorService;

    @GetMapping("{id}")
    public ApiResponse<DataSensorResponse> findById(@PathVariable Long id) {
        DataSensorResponse response = dataSensorService.getSensorById(id);
        return ApiResponse.<DataSensorResponse>builder()
                .message("get data sensor successfully")
                .result(response)
                .build();
    }
}
