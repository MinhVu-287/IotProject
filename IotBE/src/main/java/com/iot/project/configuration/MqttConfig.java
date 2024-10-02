package com.iot.project.configuration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.project.entity.ActionLog;
import com.iot.project.entity.DataSensor;
import com.iot.project.repository.ActionLogRepository;
import com.iot.project.repository.DataSensorRepository;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

import java.time.LocalDateTime;
import java.util.Date;

@Configuration
@Slf4j
public class MqttConfig {

    @Autowired
    private ActionLogRepository actionLogRepository;

    @Autowired
    private DataSensorRepository dataSensorRepository;

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{brokerUrl});
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter("spring-mqtt-client", mqttClientFactory(),
                        "data_sensor", "action");  // Subscribe to "data_sensor" and "action" topics
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return message -> {
            String payload = message.getPayload().toString();
            Date receivedTime = new Date();

            // Log information when a message is received
            log.info("Received MQTT message at: {}", receivedTime);
            log.info("Message payload: {}", payload);

            // Parse JSON data
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                JsonNode jsonNode = objectMapper.readTree(payload);

                // Check if the JSON has the required fields
                if (jsonNode.has("temperature") && jsonNode.has("humidity") && jsonNode.has("light")) {
                    saveDataSensor(jsonNode);
                } else {
                    log.warn("JSON missing required fields.");
                }

                // Check for an action log
                if (jsonNode.has("action")) {
                    saveActionLog(jsonNode);
                }
            } catch (Exception e) {
                // Log error when parsing JSON
                log.error("Error parsing JSON: {}", e.getMessage());
            }
        };
    }

    @Bean
    public MqttPahoMessageHandler mqttPahoMessageHandler() {
        // Create the handler with the appropriate constructor
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler("spring-mqtt-client", mqttClientFactory());
        messageHandler.setAsync(true);
        return messageHandler;
    }

    public void sendActionMessage(String action) {
        String jsonMessage = String.format("{\"action\":\"%s\"}", action);
        Message<String> message = MessageBuilder.withPayload(jsonMessage)
                .setHeader("mqtt_topic", "action")
                .build();

        mqttPahoMessageHandler().handleMessage(message);
    }

    private void saveDataSensor(JsonNode jsonNode) {
        DataSensor dataSensor = new DataSensor();
        dataSensor.setTemperature(jsonNode.get("temperature").asText());
        dataSensor.setHumidity(jsonNode.get("humidity").asText());
        dataSensor.setLight(jsonNode.get("light").asText());
        dataSensor.setTime(LocalDateTime.now());
        try {
            dataSensorRepository.save(dataSensor);
            log.info("Saved DataSensor to MySQL.");
        } catch (Exception e) {
            log.error("Error saving DataSensor: {}", e.getMessage());
        }
    }

    private void saveActionLog(JsonNode jsonNode) {
        ActionLog actionLog = new ActionLog();
        actionLog.setDevice("esp32");
        actionLog.setAction(jsonNode.get("action").asText());
        actionLog.setTime(LocalDateTime.now());
        try {
            actionLogRepository.save(actionLog);
            log.info("Saved ActionLog to MySQL.");
        } catch (Exception e) {
            log.error("Error saving ActionLog: {}", e.getMessage());
        }
    }
}
