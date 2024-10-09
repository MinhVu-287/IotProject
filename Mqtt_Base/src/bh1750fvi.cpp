#include "bh1750fvi.h"

BH1750 lightMeter;

void BH1750FVI_Init(void)
{
    Wire.begin();
    lightMeter.begin();
}

float BH1750FVI_ReadLux(void)
{
  return lightMeter.readLightLevel();
}

