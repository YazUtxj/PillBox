#include <Arduino.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <Preferences.h>
#include <time.h>
#include <ESP32Servo.h>
#define SERVO_PIN 27
#define DHTTYPE DHT22
#define DHTPIN 18
#define NUM_LEDS 4
#define BUZZER_PIN 13

Preferences preferences;
Servo servoMotor;

bool servoEn180 = false;
unsigned long lastServoChange = 0;
const unsigned long SERVO_INTERVAL = 10000;

unsigned long simulatedStartTime = 0;
unsigned long bootMillis = 0;
time_t getCurrentTime() {
    return simulatedStartTime + (millis() - bootMillis) / 1000;
}

const char* ssid = "Tecnologias";
const char* password = "123456789";

String ipPC = "10.10.24.14";
String userId = "67e0da504940eba8e914b496";
String serverUrl = "http://"+ipPC+":3000/get-containers/" + userId;
DHT dht(DHTPIN, DHTTYPE, 22);
WebServer server(80);

const String dhtApiUrl = "http://" + ipPC + ":3000/create-graphdata";
unsigned long lastDhtSent = 0;
const unsigned long dhtInterval = 10000;

const int ledPins[NUM_LEDS] = {4, 4, 4, 4};
unsigned long ledIntervals[NUM_LEDS] = {60, 60, 60, 60};
unsigned long ledDays[NUM_LEDS] = {86400000, 86400000, 86400000, 86400000};
const int ledDuration = 8;
unsigned long startTime;
unsigned long ledTimers[NUM_LEDS] = {0};
unsigned long lastActivationTime[NUM_LEDS] = {0};
bool ledStates[NUM_LEDS] = {false};
bool ledEnabled[NUM_LEDS] = {true};
bool buzzerActive = false;
unsigned long lastLoopTime = 0;
const unsigned long loopInterval = 8;
bool modoPruebas = true;

void handleUpdateUserId() {
    if (server.hasArg("plain")) {
        String body = server.arg("plain");
        DynamicJsonDocument doc(200);
        deserializeJson(doc, body);
        if (doc.containsKey("userId")) {
            userId = doc["userId"].as<String>();
            preferences.putString("userId", userId);
            serverUrl = "http://" + ipPC + ":3000/get-containers/" + userId;
            Serial.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            Serial.println("\n🔄 ID de usuario actualizado y almacenado:");
            Serial.println(userId);
            Serial.println("🔄 Nueva URL de la API:");
            Serial.println(serverUrl);
            fetchDataFromAPI();
            server.send(200, "application/json", "{\"message\": \"ID actualizado y datos recargados\"}");
        } else {
            server.send(400, "application/json", "{\"error\": \"Falta el campo 'userId'\"}");
        }
    } else {
        server.send(400, "application/json", "{\"error\": \"No se recibió JSON válido\"}");
    }
}

void setup() {
    Serial.begin(115200);
    for (int i = 0; i < NUM_LEDS; i++) {
      pinMode(ledPins[i], OUTPUT);
      digitalWrite(ledPins[i], LOW);
    }
    dht.begin();
    preferences.begin("esp32", false);
    String storedUserId = preferences.getString("userId", "");
    if (userId == "") {
        Serial.println("No hay un userId almacenado.");
    } else {
        userId = storedUserId;
        Serial.println("UserId cargado de memoria: " + userId);
    }
    serverUrl = "http://" + ipPC + ":3000/get-containers/" + userId;
    WiFi.begin(ssid, password);
    Serial.print("Conectando a WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nConectado a WiFi!");
    Serial.print("Dirección IP de la ESP32: ");
    Serial.println(WiFi.localIP());

    simulatedStartTime = 1704067200;
    bootMillis = millis();
    Serial.println("⏱️ 2024-01-01 00:00:00");

    server.on("/update-user", HTTP_POST, handleUpdateUserId);
    server.begin();
    Serial.println("Servidor HTTP iniciado!");

    fetchDataFromAPI();
    
    //! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SERVOMOTOR
    servoMotor.setPeriodHertz(50);  // Frecuencia estándar para servos
    servoMotor.attach(SERVO_PIN);   // Asegúrate de que SERVO_PIN esté bien definido
    servoMotor.write(90);           // Posición inicial
}

void loop() {
    server.handleClient();
    unsigned long currentMillis = millis();
    if (currentMillis - lastLoopTime < loopInterval) {
        return;
    }
    lastLoopTime = currentMillis;

    time_t now = getCurrentTime();
    bool anyValidContainer = false;
    for (int i = 0; i < NUM_LEDS; i++) {
        if (!ledEnabled[i]) continue;
        anyValidContainer = true;
        unsigned long elapsedSeconds = now - lastActivationTime[i];
        if (!ledStates[i] && elapsedSeconds >= ledIntervals[i]) {
            turnOn(i);
            lastActivationTime[i] = now;
        }
        if (ledStates[i] && (currentMillis - ledTimers[i]) / 1000 >= ledDuration) {
            turnOff(i);
        }
    }
    
    bool anyLedOn = isAnyLedOn();
    if (anyLedOn && anyValidContainer && !buzzerActive) {
        setBuzzerTone(2500);
        buzzerActive = true;
    } else if ((!anyLedOn || !anyValidContainer) && buzzerActive) {
        noTone(BUZZER_PIN);
        buzzerActive = false;
    }
    if (currentMillis - lastDhtSent > dhtInterval) {
        float temp = dht.readTemperature();
        float humidity = dht.readHumidity();

        if (!isnan(temp) && !isnan(humidity)) {
            Serial.printf("🌡️ Temp: %.2f °C, 💧 Humedad: %.2f %%\n", temp, humidity);
            sendDHTData(temp, humidity);
            lastDhtSent = currentMillis;
        } else {
            Serial.println("⚠️ Error leyendo el DHT");
            delay(2000);
        }
    }

    //! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SERVOMOTOR
    static bool servoCycleStarted = false;
    static unsigned long servoCycleStartTime = 0;

    if (anyLedOn && anyValidContainer && !servoCycleStarted) {
        // Inicia el ciclo del servo
        servoMotor.write(180); // Mueve a 180°
        servoCycleStartTime = currentMillis;
        servoCycleStarted = true;
    }

    if (servoCycleStarted && currentMillis - servoCycleStartTime >= 200) {
        // Después de 200 ms, regresa a 90°
        servoMotor.write(90);
        servoCycleStarted = false;
    }
}

void fetchDataFromAPI() {
    if (WiFi.status() == WL_CONNECTED && userId != "") {
        HTTPClient http;
        http.begin(serverUrl);
        int httpResponseCode = http.GET();

        if (httpResponseCode == 200) {
            String response = http.getString();
            Serial.println("\n📦 Datos recibidos de la API:");
            Serial.println(response);

            DynamicJsonDocument doc(1024);
            deserializeJson(doc, response);
            int index = 0;
            time_t now = getCurrentTime();

            for (JsonObject container : doc.as<JsonArray>()) {
                if (index < NUM_LEDS) {
                    int hours = container["hours"].as<int>();
                    int days = container["days"].as<int>();

                    if (modoPruebas) {
                      hours = hours * 1;
                      days = days * 2;
                      Serial.print("⚠️");
                    }

                    if (hours == 0 || days == 0) {
                        ledIntervals[index] = 0;
                        ledDays[index] = 0;
                        ledEnabled[index] = false;
                        Serial.printf("❎ Contenedor %d desactivado (0h, 0d)\n", index);
                    } else {
                        ledIntervals[index] = hours * (modoPruebas ? 60 : 3600);
                        ledDays[index] = days * (modoPruebas ? 3600 : 86400);
                        ledEnabled[index] = true;

                        lastActivationTime[index] = now;

                        Serial.printf("✅ Contenedor %d: %d horas -> %lu segundos\n", index, hours, (modoPruebas ? "minutos" : "horas"), ledIntervals[index]);
                        Serial.printf("Días: %d -> %lu segundos\n", days, (modoPruebas ? "horas" : "días"), ledDays[index]);
                    }
                    index++;
                }
            }
            Serial.println("Datos actualizados!");
        } else {
            Serial.print("❌ Error en la petición: ");
            Serial.println(httpResponseCode);
        }
        http.end();
    } else {
        Serial.println("❌ WiFi no conectado o userId vacío");
    }
}

void sendDHTData(float temp, float humidity) {
    if (WiFi.status() == WL_CONNECTED && userId != "") {
        HTTPClient http;
        http.begin(dhtApiUrl);
        http.addHeader("Content-Type", "application/json");

        DynamicJsonDocument doc(256);
        doc["user_id"] = userId;
        doc["temp"] = temp;
        doc["humidity"] = humidity;

        String body;
        serializeJson(doc, body);

        int httpCode = http.POST(body);
        if (httpCode == 201) {
            Serial.println("✅ Datos DHT enviados correctamente");
        } else {
            Serial.print("❌ Error al enviar datos DHT: ");
            Serial.println(httpCode);
            Serial.println(http.getString());
        }
        http.end();
    } else {
        Serial.println("❌ No conectado a WiFi o userId vacío");
    }
}

void turnOn(int ledIndex) {
    if (!ledEnabled[ledIndex]) return;
    digitalWrite(ledPins[ledIndex], HIGH);
    ledStates[ledIndex] = true;
    ledTimers[ledIndex] = millis();
    Serial.print("LED encendido: ");
    Serial.println(ledIndex);
}
void turnOff(int ledIndex) {
    if (!ledEnabled[ledIndex]) return;
    digitalWrite(ledPins[ledIndex], LOW);
    ledStates[ledIndex] = false;
    Serial.print("LED apagado: ");
    Serial.println(ledIndex);
}
bool isAnyLedOn() {
    for (int i = 0; i < NUM_LEDS; i++) {
        if (ledStates[i]) {
            return true;
        }
    }
    return false;
}
void setBuzzerTone(int frequency) {
    tone(BUZZER_PIN, frequency);
}
