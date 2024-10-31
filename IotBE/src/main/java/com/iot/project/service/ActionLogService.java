package com.iot.project.service;

import com.iot.project.dto.response.ActionLogResponse;
import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.dto.response.PagedResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface ActionLogService {
    PagedResponse<ActionLogResponse> getAllActionsByCondition(Pageable pageable, String search, LocalDateTime startDate, LocalDateTime endDate);

    ActionLogResponse getLatestAction();
}
