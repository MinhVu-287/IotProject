package com.iot.project.repository;

import com.iot.project.entity.ActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {
}
