package com.iot.project.dto.projection;

import java.time.LocalDateTime;

public interface DataSensorProjection {
    Long getId();
    String getTemperature();
    String getHumidity();
    String getLight();
    String getCo2();
    LocalDateTime getTime();
}
