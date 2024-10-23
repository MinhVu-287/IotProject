package com.iot.project.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.project.consant.ConstantValue;
import com.iot.project.dto.ApiResponse;
import com.iot.project.dto.response.ActionLogResponse;
import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.dto.response.PagedResponse;
import com.iot.project.entity.ActionLog;
import com.iot.project.repository.ActionLogRepository;
import com.iot.project.service.ActionLogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/action")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActionLogController {
    ActionLogService actionLogService;
    @Autowired
    private MqttPahoMessageHandler mqttPahoMessageHandler;
    ActionLogRepository actionLogRepository;

    @GetMapping
    public ApiResponse<PagedResponse<ActionLogResponse>> getAllActionsWithCondition(
            @RequestParam(defaultValue = ConstantValue.CURRENT_PAGE) int page,
            @RequestParam(defaultValue = ConstantValue.PAGE_SIZE) int size,
            @RequestParam(defaultValue = ConstantValue.SORT_STRATEGY) String[] sort,
            @RequestParam(required = false) String search) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Order.desc(sort[0])));
        return ApiResponse.<PagedResponse<ActionLogResponse>>builder()
                .message("successfully")
                .result(actionLogService.getAllActionsByCondition(pageRequest, search))
                .build();
    }

    @PostMapping
    public String sendAction(@RequestBody String actionJson) {
        // Tạo message từ chuỗi JSON
        Message<String> message = MessageBuilder.withPayload(actionJson)
                .setHeader("mqtt_topic", "action") // Đặt topic
                .build();

        // Gửi message đến topic MQTT
        mqttPahoMessageHandler.handleMessage(message);

        // Parse the JSON to extract device and action
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> actionMap = objectMapper.readValue(actionJson, new TypeReference<Map<String, String>>() {});

            String device = "";
            String action = "";

            if (actionMap.containsKey("led")) {
                device = "led";
                action = "1".equals(actionMap.get("led")) ? "is on" : "is off";
            } else if (actionMap.containsKey("fan")) {
                device = "fan";
                action = "1".equals(actionMap.get("fan")) ? "is on" : "is off";
            }

            if (!device.isEmpty()) {
                // Lưu log vào ActionLogRepository
                ActionLog actionLog = new ActionLog();
                actionLog.setDevice(device);
                actionLog.setAction(action);
                actionLog.setTime(LocalDateTime.now());
                actionLogRepository.save(actionLog);
            }

            return "Message sent to topic 'action': " + actionJson;
        } catch (Exception e) {
            return "Failed to parse JSON or save log: " + e.getMessage();
        }
    }

    @GetMapping("/latest")
    public ApiResponse<ActionLogResponse> getLatestAction() {
        return ApiResponse.<ActionLogResponse>builder()
                .message("successfully")
                .result(actionLogService.getLatestAction())
                .build();
    }
}
