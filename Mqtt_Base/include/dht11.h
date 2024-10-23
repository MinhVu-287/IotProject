#ifndef _DHT11_H
#define _DHT11_H

// Include Library
#include <DHT.h>

// Define
#define DHTPIN 14
#define DHTTYPE DHT11 // DHT 11

// Global Variables
extern DHT dht;

void DHT11_Init(void);
float DHT11_ReadTemperature(void);
float DHT11_ReadHumidity(void);

#endif