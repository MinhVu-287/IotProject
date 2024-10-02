package com.iot.project.service.impl;

import com.iot.project.dto.projection.ActionLogProjection;
import com.iot.project.dto.projection.DataSensorProjection;
import com.iot.project.dto.response.ActionLogResponse;
import com.iot.project.dto.response.DataSensorResponse;
import com.iot.project.dto.response.PagedResponse;
import com.iot.project.repository.ActionLogRepository;
import com.iot.project.service.ActionLogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActionLogServiceImpl implements ActionLogService {
    ActionLogRepository actionLogRepository;
    ModelMapper modelMapper;

    @Override
    public PagedResponse<ActionLogResponse> getAllActionsByCondition(Pageable pageable, String search) {
        Page<ActionLogProjection> Page = actionLogRepository.findActionsWithCondition(search, pageable);

        List<ActionLogResponse> content = Page.getContent().stream()
                .map(projection -> modelMapper.map(projection, ActionLogResponse.class))
                .collect(Collectors.toList());

        return PagedResponse.<ActionLogResponse>builder()
                .content(content)
                .pageNumber(Page.getNumber())
                .pageSize(Page.getSize())
                .totalElements(Page.getTotalElements())
                .totalPages(Page.getTotalPages())
                .last(Page.isLast())
                .sort(Page.getSort())
                .build();
    }
}
