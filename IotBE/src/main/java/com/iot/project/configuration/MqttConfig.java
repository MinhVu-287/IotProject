package com.iot.project.configuration;

import com.iot.project.entity.ActionLog;
import com.iot.project.entity.DataSensor;
import com.iot.project.repository.ActionLogRepository;
import com.iot.project.repository.DataSensorRepository;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import java.util.Date;

@Configuration
public class MqttConfig {

    @Autowired
    private ActionLogRepository actionLogRepository;

    @Autowired
    private DataSensorRepository dataSensorRepository;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{"tcp://localhost:1883"});  // Mosquitto broker address
        options.setUserName("admin");
        options.setPassword("admin123".toCharArray());
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
                        "esp/env");
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

            System.out.println("Received MQTT message at: " + receivedTime.toString());
            System.out.println("Message payload: " + payload);

            // Giả sử thông điệp có định dạng: "temperature:xx,humidity:yy,light:zz"
            String[] dataParts = payload.split(",");
            if (dataParts.length == 3) {  // Sửa lại để xử lý thêm humidity
                String[] temperaturePart = dataParts[0].split(":");
                String[] humidityPart = dataParts[1].split(":");
                String[] lightPart = dataParts[2].split(":");

                if (temperaturePart.length == 2 && humidityPart.length == 2 && lightPart.length == 2) {
                    // Lưu dữ liệu DataSensor
                    DataSensor dataSensor = new DataSensor();
                    dataSensor.setTemperature(temperaturePart[1]);
                    dataSensor.setHumidity(humidityPart[1]);  // Sử dụng humidity
                    dataSensor.setLight(lightPart[1]);
                    dataSensor.setTime(new Date());  // Thời gian hiện tại
                    dataSensorRepository.save(dataSensor);

                    // Lưu dữ liệu ActionLog
                    ActionLog actionLog = new ActionLog();
                    actionLog.setDevice("esp32");
                    actionLog.setAction("Data Received");
                    actionLog.setTime(new Date());  // Thời gian hiện tại
                    actionLogRepository.save(actionLog);

                    System.out.println("Saved data to MySQL.");
                }
            }
        };
    }
}

