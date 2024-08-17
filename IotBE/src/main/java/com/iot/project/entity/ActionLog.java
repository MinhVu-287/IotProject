package com.iot.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "action_log")
public class ActionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "device")
    private String device;

    @Column(name = "action")
    private String action;

    @Temporal(TemporalType.DATE)
    @Column(name = "time")
    private Date time;

}