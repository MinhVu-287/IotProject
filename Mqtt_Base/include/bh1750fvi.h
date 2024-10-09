#ifndef _BH1750FVI_H
#define _BH1750FVI_H

// Include Library
#include <Wire.h>
#include <BH1750.h>

// Function
void BH1750FVI_Init(void);
float BH1750FVI_ReadLux(void);

#endif