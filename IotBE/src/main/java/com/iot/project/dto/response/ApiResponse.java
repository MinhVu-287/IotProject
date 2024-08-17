package com.iot.project.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.iot.project.utils.ErrorCode;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse <T>{
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse success(T data) {
        return ApiResponse.<T>builder()
                .code(HttpStatus.OK.value())  // Assuming HTTP 200 for success
                .data(data)
                .build();
    }

    public static <T> ApiResponse error(ErrorCode errorCode) {
        return ApiResponse.<T>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
    }
}
