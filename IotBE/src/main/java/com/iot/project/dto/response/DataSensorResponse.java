package com.iot.project.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class DataSensorResponse {
    private Long id;
    private String temperature;
    private String humanity;
    private String light;
    private Date time;
}
