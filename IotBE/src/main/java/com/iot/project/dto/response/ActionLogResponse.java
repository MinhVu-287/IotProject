package com.iot.project.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActionLogResponse {
    private Long id;
    private String device;
    private String action;
    private LocalDateTime time;
}
