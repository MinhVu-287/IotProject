#include "MQ135.h"

double GAS = 0;
MQUnifiedsensor MQ135(placa, Voltage_Resolution, ADC_Bit_Resolution, pin, type);

void MQ135_Setup()
{
    //Set math model to calculate the PPM concentration and the value of constants   
  MQ135.setRegressionMethod(1); //_PPM =  a*ratio^b   
  MQ135.setA(110.47); 
  MQ135.setB(-2.862); 
  // Configurate the ecuation values to get NH4 concentration    
  MQ135.init();    
  Serial.print("Calibrating please wait.");   
  float calcR0 = 0;   
  for(int i = 1; i<=10; i ++)   {     
      MQ135.update(); // Update data, the arduino will be read the voltage on the analog pin     
      calcR0 += MQ135.calibrate(RatioMQ135CleanAir);    
      Serial.print(".");   
  }   
  MQ135.setR0(calcR0/10);   
  Serial.println("  done!.");      
  if(isinf(calcR0)) { Serial.println("Warning: Conection issue founded, R0 is infite (Open circuit detected) please check your wiring and supply"); while(isinf(calcR0));}   
  if(calcR0 == 0){Serial.println("Warning: Conection issue founded, R0 is zero (Analog pin with short circuit to ground) please check your wiring and supply"); while(calcR0 == 0);}   
  /*****************************  MQ CAlibration **************************/                   
  MQ135.serialDebug(true); 
}
float Read_GAS()
{
    // MQ135.serialDebug();
    MQ135.update(); // Update data, the arduino will be read the voltage on the analog pin   
    GAS = MQ135.readSensor(); // Sensor will read CO2 concentration using the model and a and b values setted before or in the setup   
    return GAS;
}