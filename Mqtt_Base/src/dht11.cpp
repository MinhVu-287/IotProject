#include "dht11.h"

DHT dht(DHTPIN, DHTTYPE);

void DHT11_Init(void)
{
  dht.begin();
}

float DHT11_ReadTemperature(void)
{
  return dht.readTemperature(true);
}

float DHT11_ReadHumidity(void)
{
  return dht.readHumidity();
}

