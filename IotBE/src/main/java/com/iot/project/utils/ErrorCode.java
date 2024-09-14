package com.iot.project.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    FIELD_NOT_EXIST(400, "This field does not exist", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER_ERROR(500, "Internal server error.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
