package com.iot.project.controller;

import com.iot.project.dto.ApiResponse;
import com.iot.project.dto.response.ActionLogResponse;
import com.iot.project.service.ActionLogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/action")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActionLogController {
    ActionLogService actionLogService;

}
