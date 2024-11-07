#ifndef MQ135_H
#define MQ135_H

#include <MQUnifiedsensor.h>
#include <Arduino.h>

#define placa "ESP-32"
#define Voltage_Resolution 3.3
#define type "MQ-5"
#define ADC_Bit_Resolution 12
#define RatioMQ135CleanAir 3.6  


void MQ135_Setup();
float Read_CO2();

#endif