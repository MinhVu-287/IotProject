#include "mqtt.h"

// Define
WiFiClient espClient;
PubSubClient client(espClient);

// Wifi Connection
const char* ssid =          "MINHVULAP";
const char* password =      "12345678";
// Mqtt Connection
const char *mqtt_broker=    "192.168.137.1";
const char *topic_pub =     "data_sensor";
const char *topic_sub =     "action";
const char *mqtt_username = "admin";
const char *mqtt_password = "admin123";
const int   mqtt_port =     1883;

JsonDocument doc;
static String Mqtt_CreateMessage(float temperature, float humidity, float light);
static void Mqtt_Publish(const char *topic);
static void Mqtt_Callback(char *topic, byte *payload, unsigned int length);
static void Message_Receive(String _message);

void Mqtt_Init() {
  // Wifi Connecting
  // Init led 23
  pinMode(25, OUTPUT);
  digitalWrite(25, LOW);

  pinMode(18, OUTPUT);
  digitalWrite(18, LOW);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Setup Mqtt
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(Mqtt_Callback);
    // Mqtt Connecting
  while (!client.connected()) 
  {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the mqtt broker\n", client_id.c_str());
    if(client.connect(client_id.c_str(), mqtt_username, mqtt_password))
    {
      client.publish(topic_pub, "12345");
      client.subscribe(topic_sub);
    } 
    else{
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(50);
    }
  }
}

void Mqtt_Reconnect(void)
{
  while (!client.connected()) 
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
      client.subscribe(topic_sub);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void Mqtt_Loop(void)
{
  client.loop();
}

void MqttSend()
{
  Mqtt_Publish(topic_pub);
}

void Mqtt_Publish(const char *topic)
{
    String message = Mqtt_CreateMessage(DHT11_ReadTemperature(), DHT11_ReadHumidity(), BH1750FVI_ReadLux());
    const char *payload = (const char *)message.c_str();
    client.publish(topic, payload);
    //delay(5000);
}

String Mqtt_CreateMessage(float temperature, float humidity, float light)
{
    if (isnan(temperature) || isnan(humidity) || isnan(light)) 
    {
      Serial.println("Failed to read from DHT sensor!");
      return "failed";
    }
    String message = "";
    doc.clear();
    deserializeJson(doc, message);
    doc["temperature"] = serialized(String(temperature, 2));
    doc["humidity"] =  serialized(String(humidity, 2));
    doc["light"] = serialized(String(light, 2));
    serializeJson(doc, message);
    Serial.println(message);
    return message;
}
// sub
// void Mqtt_Callback(char *topic, byte *payload, unsigned int length)
// {
//   Serial.print("Message arrived on topic: ");
//   Serial.println(topic);
//   // Serial.print(". Message: ");
//   String message_str = (const char*) payload;
//   // Serial.println(message_str);
//   Message_Receive(message_str);
// }
void Mqtt_Callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  // Serial.print(". Message: ");
  String message_str = (const char*) payload;
  Serial.println(message_str);
   // Chuyển đổi payload thành C-style string (chuỗi kết thúc bằng ký tự null)
  // char message_str[length + 1];  // Tạo một mảng char để lưu chuỗi
  // memcpy(message_str, payload, length);
  // message_str[length] = '\0';  // Thêm ký tự kết thúc chuỗi

  // Kiểm tra nếu topic là "action"
  // if (strcmp(topic, "action") == 0) {
  //   if (strcmp(message_str, "led1 on") == 0) {
  //     digitalWrite(23, HIGH);  // Bật LED chân 25
  //     Serial.println("LED1 turned on");
  //   } else if (strcmp(message_str, "led1 off") == 0) {
  //     digitalWrite(23, LOW);  // Tắt LED chân 25
  //     Serial.println("LED1 turned off");
  //   } else if (strcmp(message_str, "led2 on") == 0) {
  //     digitalWrite(18, HIGH);  // Bật LED chân 18
  //     Serial.println("LED2 turned on");
  //   } else if (strcmp(message_str, "led2 off") == 0) {
  //     digitalWrite(18, LOW);  // Tắt LED chân 18
  //     Serial.println("LED2 turned off");
  //   } else if (strcmp(message_str, "all on") == 0) {
  //     digitalWrite(23, HIGH);  // Bật LED chân 25
  //     digitalWrite(18, HIGH);  // Bật LED chân 18
  //     Serial.println("LED2 turned on");
  //   } else if (strcmp(message_str, "all off") == 0) {
  //     digitalWrite(23, LOW);  // Bật LED chân 25
  //     digitalWrite(18, LOW);  // Tắt LED chân 18
  //     Serial.println("LED2 turned off");
  //   }

  // }
  Message_Receive(message_str);
}
void Message_Receive(String _message)
{
    uint8_t resp_type = 0;
    doc.clear();
    DeserializationError error =  deserializeJson(doc, _message);
    if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
    }
    String led = doc["led"].as<String>();
    String fan = doc["fan"].as<String>();
    if (strcmp(led.c_str(), "1") == 0)
    {
        digitalWrite(25, HIGH);
    }
    else if(strcmp(led.c_str(), "0") == 0){
        digitalWrite(25, LOW);
    }
    if (strcmp(fan.c_str(), "1") == 0)
    {
        digitalWrite(18, HIGH);
    }
    else if(strcmp(fan.c_str(), "0") == 0){
        digitalWrite(18, LOW);
    }
}
