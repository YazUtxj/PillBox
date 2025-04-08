#include <Arduino.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <Preferences.h>
#include <time.h>
#define DHTTYPE DHT22
#define DHTPIN 18
#define NUM_LEDS 4
#define BUZZER_PIN 13

Preferences preferences;

const char* ntpServer = "pool.ntp.org";
long gmtOffset_sec = -21600;
int daylightOffset_sec = 3600;
time_t getCurrentTime() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        Serial.println("⚠️ Error obteniendo la hora");
        return 0;
    }
    return mktime(&timeinfo);
}
const char* ssid = "HUAWEIY9a";
const char* password = "jijijija";

String ipPC = "192.168.43.130";
String userId = "67e0da504940eba8e914b496";
String serverUrl = "http://"+ipPC+":3000/get-containers/" + userId;
DHT dht(DHTPIN, DHTTYPE, 22);
WebServer server(80);

const int ledPins[NUM_LEDS] = {4, 5, 19, 21};
unsigned long ledIntervals[NUM_LEDS] = {60, 60, 60, 60};
unsigned long ledDays[NUM_LEDS] = {86400000, 86400000, 86400000, 86400000};
const int ledDuration = 10;
unsigned long startTime;
unsigned long ledTimers[NUM_LEDS] = {0};
unsigned long lastActivationTime[NUM_LEDS] = {0};
bool ledStates[NUM_LEDS] = {false};
bool ledEnabled[NUM_LEDS] = {true};
bool buzzerActive = false;
unsigned long lastLoopTime = 0;
const unsigned long loopInterval = 10;
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
    } // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    dht.begin();
    preferences.begin("esp32", false);
    userId = preferences.getString("userId", "");
    if (userId == "") {
        Serial.println("No hay un userId almacenado.");
    } else {
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

    struct tm timeinfo;
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    Serial.println("⌚ Sincronizando con NTP...");
    int attempts = 0;
    while (!getLocalTime(&timeinfo) && attempts < 5) {
        delay(1000);
        attempts++;
    }
    if (attempts == 5) {
        Serial.println("⚠️ No se pudo sincronizar con NTP después de varios intentos");
    } else {
        Serial.println("⌚ Hora sincronizada con NTP");
    }

    server.on("/update-user", HTTP_POST, handleUpdateUserId);
    server.begin();
    Serial.println("Servidor HTTP iniciado!");

    fetchDataFromAPI();
}

void loop() {
    server.handleClient();
        checkAndDisableExpiredContainers(); //! ------------------------------------------------------------------------------
    unsigned long currentMillis = millis();
    if (currentMillis - lastLoopTime < loopInterval) {
        return;
    }
    lastLoopTime = currentMillis;



    



    //! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    if (currentMillis % 10000 == 0) {
        time_t now = getCurrentTime();
        
        for (int i = 0; i < NUM_LEDS; i++) {
            if (ledEnabled[i]) {
                unsigned long elapsedTime = now - lastActivationTime[i];
                unsigned long remainingTime = ledIntervals[i] - elapsedTime;
                Serial.print("Contenedor ");
                Serial.print(i);
                Serial.print(" - Tiempo restante para la alarma: ");
                Serial.print(remainingTime / 60);
                Serial.print(" minutos");
                Serial.println();
            }
        }
    }
    //! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



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
        setBuzzerTone(500);
        buzzerActive = true;
    } else if ((!anyLedOn || !anyValidContainer) && buzzerActive) {
        noTone(BUZZER_PIN);
        buzzerActive = false;
    }
}

























void checkAndDisableExpiredContainers() {
    time_t now = getCurrentTime();
    for (int i = 0; i < NUM_LEDS; i++) {
        if (ledEnabled[i]) {
            unsigned long elapsedTime = now - lastActivationTime[i];
            if (elapsedTime >= ledDays[i]) {
                ledEnabled[i] = false;
                digitalWrite(ledPins[i], LOW);
                ledStates[i] = false;
                
                if (WiFi.status() == WL_CONNECTED) {
                    HTTPClient http;
                    http.begin("http://" + ipPC + ":3000/edit-container");
                    http.addHeader("Content-Type", "application/json");
                    
                    String httpRequestData = "{\"containerId\":\"";
                    httpRequestData += userId; // Asumiendo que userId es el ID del contenedor
                    httpRequestData += "\",\"hours\":0,\"days\":0}";
                    
                    int httpResponseCode = http.POST(httpRequestData);
                    
                    if (httpResponseCode == 200) {
                        Serial.printf("Contenedor %d desactivado en la API\n", i);
                    } else {
                        Serial.printf("Error al desactivar contenedor %d en la API: %d\n", i, httpResponseCode);
                    }
                    http.end();
                }
            }
        }
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

                  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    if (modoPruebas) {
                      hours = hours * 1;
                      days = days * 2;
                      Serial.print("⚠️");
                    }
                  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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