package com.iot.project.service.impl;

import com.iot.project.repository.ActionLogRepository;
import com.iot.project.service.ActionLogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActionLogServiceImpl implements ActionLogService {
    ActionLogRepository actionLogRepository;
}
