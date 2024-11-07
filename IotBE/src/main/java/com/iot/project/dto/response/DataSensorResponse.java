package com.iot.project.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DataSensorResponse {
    private Long id;
    private String temperature;
    private String humidity;
    private String light;
    private String co2;
    private LocalDateTime time;
}
