#include <Arduino.h>
#include <Ticker.h>
#include "mqtt.h"

Ticker ticker;

void setup() {
  Serial.begin(115200);
  BH1750FVI_Init();
  DHT11_Init();
  MQ135_Setup();
  Mqtt_Init();
  if (!client.connected()) {
    Mqtt_Reconnect();
  }
  ticker.attach(10.0, MqttSend);
}

void loop() {
  delay(10);
  Mqtt_Loop();
}


