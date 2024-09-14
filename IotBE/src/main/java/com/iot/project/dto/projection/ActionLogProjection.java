package com.iot.project.dto.projection;

import java.util.Date;

public interface ActionLogProjection {
    Long getId();
    String getDevice();
    String getAction();
    Date getDate();
}
