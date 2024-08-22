package com.iot.project.controller;

import com.iot.project.dto.response.ApiResponse;
import com.iot.project.exception.AppException;
import com.iot.project.service.ActionLogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActionLogController {
    ActionLogService actionLogService;

    @GetMapping("/test")
    public ApiResponse getting(@RequestParam String workflowName) {
        try {
            return ApiResponse.success(null);
        } catch (AppException e) {
            return ApiResponse.error(e.getErrorCode());
        }
    }

}
