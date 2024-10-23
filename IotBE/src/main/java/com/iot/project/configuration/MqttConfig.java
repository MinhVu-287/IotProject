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
        options.setConnectionTimeout(1000);  // Increase connection timeout to 60 seconds
        options.setKeepAliveInterval(1000);  // Set keep alive interval
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    // Inbound adapter for 'data_sensor' topic
    @Bean
    public MessageProducer inboundDataSensor() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter("spring-mqtt-client-data-sensor", mqttClientFactory(),
                        "data_sensor");  // Subscribe to "data_sensor" topic
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    // Inbound adapter for 'action' topic
    @Bean
    public MessageProducer inboundAction() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter("spring-mqtt-client-action", mqttClientFactory(),
                        "action");  // Subscribe to "action" topic
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    // Inbound adapter for 'warning' topic
    @Bean
    public MessageProducer inboundWarning() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter("spring-mqtt-client-warning", mqttClientFactory(),
                        "warning");  // Subscribe to "warning" topic
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

                // Check if the JSON has the required fields for data_sensor
                if (jsonNode.has("temperature") && jsonNode.has("humidity") && jsonNode.has("light")) {
                    saveDataSensor(jsonNode);
                }
                if (jsonNode.has("warning")) {
                    saveAction(jsonNode);
                }
            } catch (Exception e) {
                // Log error when parsing JSON
                log.error("Error parsing JSON: {}", e.getMessage());
            }
        };
    }

    private void saveAction(JsonNode jsonNode) {
        ActionLog action = new ActionLog();
        action.setDevice("warning led");
        action.setAction(jsonNode.get("warning").asText());
        action.setTime(LocalDateTime.now());
        actionLogRepository.save(action);
    }

    // Save DataSensor entity to database
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

    @Bean
    public MqttPahoMessageHandler mqttPahoMessageHandler() {
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler("spring-mqtt-client", mqttClientFactory());
        messageHandler.setAsync(true);
        return messageHandler;
    }
}
