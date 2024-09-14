package com.iot.project.dto.projection;

import java.util.Date;

public interface DataSensorProjection {
    Long getID();
    String getTemperature();
    String getHumidity();
    String getLight();
    Date getTime();
}
