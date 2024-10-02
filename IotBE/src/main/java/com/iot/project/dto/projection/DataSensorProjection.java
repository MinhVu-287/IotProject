package com.iot.project.dto.projection;

import java.time.LocalDateTime;
import java.util.Date;

public interface DataSensorProjection {
    Long getId();
    String getTemperature();
    String getHumidity();
    String getLight();
    LocalDateTime getTime();
}
