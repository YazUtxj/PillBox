¡Claro! Aquí tienes un `README.md` más bonito, organizado y con emojis para que sea más visual y atractivo 🚀😄:

---

# 🌡️📦 Sistema de Monitoreo de Contenedores con ESP32

Este proyecto utiliza un **ESP32** para monitorear contenedores a través de **sensores DHT22**, **LEDs**, **buzzer**, y comunicación vía **WiFi** con una API en Node.js. ¡Perfecto para proyectos de automatización y control inteligente! ⚙️✨

---

## 📋 Características

- 📡 Conexión WiFi con red predefinida
- 🌐 Consulta de información desde una API REST
- 🔄 Sincronización de hora mediante NTP
- 💡 Control de 4 LEDs según tiempos configurados por el servidor
- 🔊 Alarma sonora con buzzer cuando algún contenedor requiere atención
- 🌡️ Lectura de temperatura con sensor DHT22
- 🔁 Interfaz HTTP para actualización de `userId` en tiempo real

---

## 🧰 Tecnologías y Librerías

- [ArduinoJson](https://arduinojson.org/)
- [DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library)
- WiFi y HTTPClient para conexión a Internet
- WebServer integrado en ESP32
- Preferences para almacenamiento persistente

---

## 📦 Hardware Requerido

| Componente       | Descripción              |
|------------------|--------------------------|
| ESP32            | Microcontrolador principal |
| Sensor DHT22     | Sensor de temperatura y humedad |
| LEDs x4          | Indicadores visuales     |
| Buzzer           | Alarma sonora            |
| Cables, protoboard, etc. | Conexiones básicas |

---

## 🔌 Pines Utilizados

| Elemento        | Pin ESP32 |
|------------------|-----------|
| DHT22            | GPIO 18   |
| LEDs             | GPIOs 4, 5, 19, 21 |
| Buzzer           | GPIO 13   |

---

## ⚙️ Configuración Inicial

1. Edita las siguientes variables en el código para conectar con tu red y API:
```cpp
const char* ssid = "HUAWEIY9a";
const char* password = "jijijija";
String ipPC = "192.168.43.130";
String userId = "67e0da504940eba8e914b496";
```

2. La URL de la API se genera dinámicamente:
```cpp
String serverUrl = "http://" + ipPC + ":3000/get-containers/" + userId;
```

3. El dispositivo sincroniza la hora con el servidor NTP:
```cpp
const char* ntpServer = "pool.ntp.org";
long gmtOffset_sec = -21600; // GMT-6
int daylightOffset_sec = 3600; // Horario de verano
```

---

## 🌐 Endpoints HTTP

| Método | Ruta           | Descripción                              |
|--------|----------------|------------------------------------------|
| POST   | `/update-user` | Recibe un nuevo `userId` para consultar nuevos contenedores |

Ejemplo de JSON:
```json
{
  "userId": "nuevo_id_de_usuario"
}
```

---

## 🔁 Lógica de Funcionamiento

### 1. Inicio (`setup()`):
- Configura los pines, sensor y WiFi.
- Sincroniza con NTP.
- Recupera configuración previa (`Preferences`).
- Consulta la API y obtiene los tiempos de los contenedores.

### 2. Bucle Principal (`loop()`):
- Gestiona los LEDs de acuerdo al tiempo transcurrido.
- Activa el buzzer si algún LED está encendido.
- Verifica si algún contenedor ha caducado y actualiza la API.

---

## 🧪 Modo de Pruebas

```cpp
bool modoPruebas = true;
```

Cuando está activo:
- Multiplica los **horas** y **días** recibidos para pruebas rápidas.

---

## 🔔 Alarma y Control

- Si el tiempo configurado se cumple:
  - 🔅 El LED correspondiente se enciende por un tiempo breve (`ledDuration`)
  - 🔔 El buzzer suena si hay al menos un LED encendido

- Si un contenedor excede el tiempo total (`ledDays`):
  - ❌ Se desactiva local y remotamente

---

## 📤 Comunicación con API

- **GET**: `/get-containers/:userId` → recibe configuración de contenedores
- **POST**: `/edit-container` → desactiva contenedores caducados

Ejemplo de cuerpo de desactivación:
```json
{
  "containerId": "67e0da504940eba8e914b496",
  "hours": 0,
  "days": 0
}
```

---

## 🧠 Archivos Importantes

- `fetchDataFromAPI()` → Sincroniza contenedores desde el servidor.
- `checkAndDisableExpiredContainers()` → Verifica y desactiva contenedores vencidos.
- `handleUpdateUserId()` → Actualiza dinámicamente el `userId`.
- `turnOn() / turnOff()` → Controlan LEDs individuales.
- `setBuzzerTone()` → Activa buzzer a una frecuencia deseada.

---

## ✅ Ejemplo en Consola

```
Conectando a WiFi...
Conectado a WiFi!
Dirección IP de la ESP32: 192.168.43.155
⌚ Sincronizando con NTP...
⌚ Hora sincronizada con NTP
📦 Datos recibidos de la API:
[
  {
    "hours": 2,
    "days": 1
  },
  ...
]
✅ Contenedor 0: 2 horas -> 7200 segundos
Días: 1 -> 86400 segundos
```

---

## 🧪 Futuras mejoras

- Panel de configuración web
- Visualización en pantalla OLED
- Notificaciones vía Telegram o correo
- Soporte para múltiples sensores

---

¿Te gustaría que lo convierta a PDF también? 📄