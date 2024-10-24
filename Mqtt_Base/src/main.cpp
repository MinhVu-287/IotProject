#include <Arduino.h>
#include <Ticker.h>
#include "mqtt.h"

Ticker ticker_sendData;
Ticker ticker_checkWarn;

void setup() {
  Serial.begin(115200);
  Led_Init();
  BH1750FVI_Init();
  DHT11_Init();
  Mqtt_Init();
  if (!client.connected()) {
    Mqtt_Reconnect();
  }
  ticker_sendData.attach(10.0, MqttSend);
  ticker_checkWarn.attach_ms(50, Mqtt_LightWarning);
}

void loop() {
  delay(10);
  Mqtt_Loop();
  if (flag_warn){
    blinkLED(WARNING_PIN, 500);  // Nháy LED mỗi 500ms
    if(!lightHighSent)
    {
      Mqtt_SendWarning();
    }
  }
  else if(!flag_warn)
  {
    digitalWrite(WARNING_PIN, LOW);
  }
}