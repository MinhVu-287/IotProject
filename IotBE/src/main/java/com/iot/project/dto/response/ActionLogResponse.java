package com.iot.project.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class ActionLogResponse {
    private Long id;
    private String device;
    private String action;
    private Date time;
}
