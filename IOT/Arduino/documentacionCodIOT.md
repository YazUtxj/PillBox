# 🚀 Proyecto ESP32 - PillBox

Este proyecto implementa un sistema de monitoreo y control basado en ESP32 que:
- Lee temperatura y humedad con un sensor **DHT22**
- Se conecta a una **API REST** para obtener información de contenedores
- Controla LEDs, un **servo motor** y un **buzzer** según reglas temporales
- Envía datos del sensor a un servidor remoto
- Expone un **servidor web** para actualizar el `userId`

---

## 🔧 Características principales

- **Sensor DHT22**: Mide temperatura y humedad cada 10 segundos y los envía a la API.
- **Servo motor**: Se activa brevemente (180°) al encender cualquier LED, y regresa a 90°.
- **4 LEDs**: Simulan contenedores, se activan de forma periódica según datos obtenidos del servidor.
- **Buzzer**: Se activa cuando cualquier LED está encendido.
- **Servidor web (puerto 80)**: Permite actualizar el `userId` vía POST (`/update-user`).
- **Preferencias (EEPROM)**: Guarda el `userId` entre reinicios.
- **Modo de pruebas (`modoPruebas`)**: Acelera tiempos de simulación.

---

## 🔌 Hardware utilizado

- ESP32
- Sensor DHT22 (GPIO 18)
- Servo motor (GPIO 27)
- Buzzer (GPIO 13)
- 4 LEDs (GPIO 4 – mismo pin en este caso, puedes separar si deseas)
- Conexión WiFi

---

## 🌐 Endpoints

- `POST /update-user`: Recibe un JSON con nuevo `userId`, lo guarda y actualiza los datos.

Ejemplo JSON:
```json
{
  "userId": "nuevo_id_aqui"
}
```

---

## 🔗 Conexión a API

- **GET** `/get-containers/:userId`  
  Recibe la configuración de tiempos (horas y días) para los contenedores.
  
- **POST** `/create-graphdata`  
  Envía los datos de temperatura y humedad en formato JSON.

---

## 🛠️ Configuración

En el código puedes modificar:

```cpp
const char* ssid = "Tecnologias";
const char* password = "123456789";
String ipPC = "10.10.24.14"; // IP de tu servidor
String userId = "67e0da504940eba8e914b496";
```

---

## 🚦 Lógica de LEDs

Cada LED:
- Se enciende si ha pasado cierto intervalo (`hours`)
- Se apaga después de 8 segundos
- Se puede desactivar desde el backend (si `hours` o `days` son 0)

---

## 🧪 Modo de pruebas

Activado por defecto:
```cpp
bool modoPruebas = true;
```
Multiplica los tiempos por factores más pequeños para facilitar pruebas.

---

## 📦 Dependencias

Incluye las siguientes librerías:
- `WiFi.h`
- `HTTPClient.h`
- `ArduinoJson.h`
- `WebServer.h`
- `DHT.h`
- `Preferences.h`
- `ESP32Servo.h`

---