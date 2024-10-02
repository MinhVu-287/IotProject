package com.iot.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "data_sensor")
public class DataSensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "temperature")
    private String temperature;

    @Column(name = "humidity")
    private String humidity;

    @Column(name = "light")
    private String light;

    @Column(name = "time")
    private LocalDateTime time;
}