package com.iot.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
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
    private Integer temperature;

    @Column(name = "humanity")
    private Integer humanity;

    @Column(name = "light")
    private String light;

    @Temporal(TemporalType.DATE)
    @Column(name = "time")
    private Date time;

}