package com.iot.project.dto.projection;

import java.time.LocalDateTime;

public interface ActionLogProjection {
    Long getId();
    String getDevice();
    String getAction();
    LocalDateTime getTime();
}
