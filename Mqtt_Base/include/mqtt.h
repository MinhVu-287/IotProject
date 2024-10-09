#ifndef _MQTT_H_
#define _MQTT_H_

// Include Library
#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <String.h>

// Include Header File
#include "dht11.h"
#include "bh1750fvi.h"

extern PubSubClient client;

// Function
void Mqtt_Init(void);
void Mqtt_Reconnect(void);
void Mqtt_Loop(void);
void MqttSend();

#endif