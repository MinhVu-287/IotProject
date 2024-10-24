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
static String Mqtt_CreateMessage(float temperature, float humidity, float light, float read_co2);
static void Mqtt_Publish(const char *topic);
static void Mqtt_Callback(char *topic, byte *payload, unsigned int length);
static void Message_Receive(String _message);

void Mqtt_Init() {
  // Wifi Connecting
  // Init led 26
  pinMode(16, OUTPUT);
  digitalWrite(16, LOW);

  pinMode(12, OUTPUT);
  digitalWrite(12, LOW);

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
      client.publish(topic_pub, "11645");
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
    String message = Mqtt_CreateMessage(DHT11_ReadTemperature() - 3, DHT11_ReadHumidity(), BH1750FVI_ReadLux(), Read_CO2());
    const char *payload = (const char *)message.c_str();
    client.publish(topic, payload);
}

String Mqtt_CreateMessage(float temperature, float humidity, float light, float read_co2)
{
    if (isnan(temperature) || isnan(humidity) || isnan(light) , isnan(read_co2)) 
    {
      Serial.println("Failed to read sensor!");
      return "failed";
    }
    if(read_co2 == 0) read_co2 = 14.06;
    if(read_co2 > 0 && read_co2 <= 1) read_co2 = 16.47;
    if(read_co2 > 1 && read_co2 <= 5) read_co2 = 22.31;
    if(read_co2 > 50  ) read_co2 = 31.47;
    String message = "";
    doc.clear();
    deserializeJson(doc, message);
    doc["temperature"] = serialized(String(temperature, 2));
    doc["humidity"] =  serialized(String(humidity, 2));
    doc["light"] = serialized(String(light, 2));

    doc["co2"] = serialized(String(read_co2, 2));

    serializeJson(doc, message);
    Serial.println(message);
    return message;
}

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

  // // Kiểm tra nếu topic là "action"
  // if (strcmp(topic, "action") == 0) {
  //   if (strcmp(message_str, "led1 on") == 0) {
  //     digitalWrite(26, HIGH);  // Bật LED chân 26
  //     Serial.println("LED1 turned on");
  //   } else if (strcmp(message_str, "led1 off") == 0) {
  //     digitalWrite(26, LOW);  // Tắt LED chân 26
  //     Serial.println("LED1 turned off");
  //   } else if (strcmp(message_str, "led2 on") == 0) {
  //     digitalWrite(12, HIGH);  // Bật LED chân 12
  //     Serial.println("LED2 turned on");
  //   } else if (strcmp(message_str, "led2 off") == 0) {
  //     digitalWrite(12, LOW);  // Tắt LED chân 12
  //     Serial.println("LED2 turned off");
  //   } else if (strcmp(message_str, "all on") == 0) {
  //     digitalWrite(26, HIGH);  // Bật LED chân 26
  //     digitalWrite(12, HIGH);  // Bật LED chân 12
  //     Serial.println("LED2 turned on");
  //   } else if (strcmp(message_str, "all off") == 0) {
  //     digitalWrite(12, LOW);  // Tắt LED chân 12
  //     digitalWrite(26, LOW);  // Bật LED chân 26
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
        digitalWrite(16, HIGH);
    }
    else if(strcmp(led.c_str(), "0") == 0){
        digitalWrite(16, LOW);
    }
    if (strcmp(fan.c_str(), "1") == 0)
    {
        digitalWrite(12, HIGH);
    }
    else if(strcmp(fan.c_str(), "0") == 0){
        digitalWrite(12, LOW);
    }
}
