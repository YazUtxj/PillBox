# Proyecto ESP32: Gestión de Contenedores con Alarmas

Este proyecto para ESP32 integra diversas funcionalidades para el manejo y control de contenedores, utilizando sensores, notificaciones visuales y auditivas, y comunicación con un servidor remoto. El código se encarga de conectarse a una red WiFi, sincronizar la hora mediante NTP, obtener datos de configuración para contenedores desde una API, activar LEDs y un buzzer según intervalos establecidos y gestionar la actualización del identificador de usuario mediante un endpoint HTTP.

## Características Principales

- **Conectividad WiFi:** Configurado para conectarse a una red definida.
- **Sincronización de Hora (NTP):** Se conecta a un servidor NTP para obtener la hora local, ajustada a la zona horaria.
- **Lectura de Sensor DHT22:** Incluye la librería DHT para la captura de datos ambientales (temperatura y humedad) si se requiere extender la funcionalidad.
- **Servidor HTTP Local:** Permite actualizar el `userId` a través de peticiones POST en el endpoint `/update-user`.
- **Comunicación con API Remota:** Realiza peticiones GET a un servidor para obtener parámetros de configuración (horas y días) de cada contenedor.
- **Control de LEDs y Buzzer:** 
  - Activación de 4 LEDs en función del tiempo transcurrido desde la última activación.
  - Activación de un buzzer cuando al menos un LED está encendido.
- **Gestión de Contenedores Expirados:** Revisa y desactiva contenedores que ya han pasado el límite de tiempo configurado, notificándolo también al servidor API mediante una petición HTTP POST.
- **Persistencia:** Utiliza la librería `Preferences` para almacenar y recuperar el `userId` entre reinicios del dispositivo.
- **Modo Pruebas:** Permite modificar los intervalos de tiempo para pruebas, ajustando la multiplicación de horas y días.

## Requerimientos

### Hardware
- **ESP32**
- **Sensor DHT22** (conectado al pin 18)
- **4 LEDs** (conectados a pines 4, 5, 19 y 21)
- **Buzzer** (conectado al pin 13)

### Red y Servidor
- Conexión WiFi configurada (por ejemplo, SSID: `HUAWEIY9a` y password: `jijijija`).
- Servidor API corriendo en la IP `192.168.43.130` en el puerto `3000`, que proporcione datos de configuración para contenedores con la ruta `/get-containers/<userId>` y acepte actualizaciones de estado de contenedores en `/edit-container`.

### Librerías de Arduino
- `Arduino.h`
- `DHT.h`
- `WiFi.h`
- `HTTPClient.h`
- `ArduinoJson.h`
- `WebServer.h`
- `Preferences.h`
- `time.h`

Asegúrate de tener instaladas estas librerías en tu entorno de Arduino IDE (o PlatformIO) para poder compilar y cargar el código correctamente.

## Instalación y Configuración

1. **Configurar el Entorno:**
   - Selecciona la placa ESP32 en el entorno de desarrollo.
   - Instala todas las librerías necesarias (puedes instalarlas a través del Library Manager del IDE).

2. **Conexión de Hardware:**
   - Conecta el sensor DHT22 al pin 18 (según tu cableado).
   - Conecta los LEDs a los pines 4, 5, 19 y 21.
   - Conecta el buzzer al pin 13.
   
3. **Configuración de Variables:**
   - **WiFi:** Cambia los valores de `ssid` y `password` si tu red tiene otros credenciales.
   - **Servidor API:** Modifica la variable `ipPC` (IP del servidor) y asegúrate de que el puerto (3000) es el correcto.
   - **Zona Horaria:** Ajusta `gmtOffset_sec` y `daylightOffset_sec` de acuerdo a tu ubicación.

4. **Subir el Código:**
   - Compila y sube el sketch al ESP32 a través del Arduino IDE o PlatformIO.

## Descripción del Código

### 1. Inicialización y Configuración
- **Inclusión de Librerías:** Se incluyen librerías para manejo de sensores, conectividad, comunicación HTTP, manejo de JSON, servidor web y almacenamiento persistente.
- **Definición de Pines y Constantes:** Se definen pines para el sensor DHT22, LEDs y buzzer, además del tipo de sensor (DHT22) y la cantidad de LEDs.
- **Preferencias:** Se utiliza la librería `Preferences` para almacenar el `userId` que identifica al usuario y se utiliza para las peticiones a la API.

### 2. Conexión WiFi y Sincronización con NTP
- **WiFi:** En la función `setup()`, se inicia la conexión a la red WiFi y se espera a que ésta se conecte correctamente.
- **Sincronización de Hora:** Se configura y sincroniza la hora local utilizando `configTime()` y se verifica la sincronización con el servidor NTP (`pool.ntp.org`).

### 3. Configuración del Servidor HTTP Local
- Se inicia un servidor HTTP en el puerto 80.
- El endpoint `/update-user` permite actualizar el `userId` mediante una petición POST, la cual espera un JSON con el campo `"userId"` y, una vez actualizado, vuelve a cargar los datos de la API.

### 4. Comunicación con la API Remota
- **fetchDataFromAPI():** Esta función realiza una petición GET al endpoint de la API para obtener un arreglo JSON con la configuración de cada contenedor.  
  - Cada objeto JSON debe contener los campos `"hours"` y `"days"`.
  - Se ajustan los intervalos de activación de los LEDs (`ledIntervals`) y el periodo de expiración (`ledDays`) en función de estos valores y del modo de prueba (`modoPruebas`).

### 5. Gestión de LEDs y Buzzer
- **Bucle principal (`loop()`):**  
  - Se revisa periódicamente (cada `loopInterval`) el estado de cada LED.
  - Se activan los LEDs si ha transcurrido el tiempo configurado desde la última activación.
  - Cada LED permanece encendido por un tiempo determinado (`ledDuration`) y luego se apaga.
  - Si alguno de los LEDs está encendido, se activa el buzzer para emitir un tono.
- **Funciones Auxiliares:**
  - `turnOn(int ledIndex)`: Enciende el LED correspondiente y actualiza su temporizador.
  - `turnOff(int ledIndex)`: Apaga el LED correspondiente.
  - `isAnyLedOn()`: Verifica si algún LED se encuentra encendido.
  - `setBuzzerTone(int frequency)`: Activa el buzzer con una determinada frecuencia.

### 6. Gestión de Contenedores Expirados
- La función `checkAndDisableExpiredContainers()` se encarga de revisar cada contenedor. Si el tiempo transcurrido desde la última activación supera el umbral definido (`ledDays`), se desactiva el contenedor y se notifica esta modificación al servidor API mediante una petición HTTP POST.

## Endpoints HTTP

### Actualización del User ID
- **Ruta:** `/update-user`
- **Método:** POST
- **Payload Ejemplo:**

  ```json
  {
    "userId": "nuevoid123456"
  }
  ```

  La función `handleUpdateUserId()` se encarga de:
  - Validar la solicitud JSON.
  - Actualizar el `userId` en la memoria del ESP32.
  - Actualizar la URL de la API para futuras peticiones.
  - Forzar una recarga de datos desde la API.

## Personalización y Modo Pruebas

- **Modo Pruebas (`modoPruebas`):**  
  - Al activar esta variable, los valores de `hours` y `days` se ajustan para pruebas (por ejemplo, multiplicando los valores para acelerar la simulación de los intervalos de tiempo).

- **Ajustes de Intervalos:**
  - **LED Intervals:** Se configuran en segundos (o minutos, según el modo de pruebas).
  - **Contenedores Expirados:** Se calcula el tiempo que debe transcurrir para desactivar un contenedor.

## Uso y Ejecución

1. **Conexión e Inicio:**
   - El ESP32 se conecta a la red WiFi y sincroniza con el servidor NTP.
   - Se carga el `userId` almacenado (si existe) y se configura la URL de la API.
   - Se inicia el servidor HTTP local para recibir actualizaciones del `userId`.

2. **Obtención y Procesamiento de Datos:**
   - El ESP32 realiza una petición a la API para obtener la configuración de los contenedores.
   - Según los datos recibidos, se configuran los intervalos y se activan/desactivan LEDs y buzzer de acuerdo a los tiempos establecidos.

3. **Actualizaciones Remotas:**
   - Mediante peticiones HTTP, es posible actualizar el `userId` y notificar al servidor cuando un contenedor ha expirado.

## Notas Adicionales

- **Depuración:**  
  El sketch utiliza `Serial.println()` para imprimir mensajes de depuración, lo cual ayuda a verificar el flujo de ejecución (por ejemplo, conexión WiFi, sincronización de hora, respuestas de la API y cambios en el estado de los contenedores).

- **Extensiones:**  
  Se puede ampliar la funcionalidad utilizando el sensor DHT22 para tomar lecturas ambientales y así complementar la lógica en función del entorno, o ajustando la lógica del buzzer y LEDs para otros tipos de notificaciones.

- **Consideraciones de Red:**  
  Asegúrate de que el servidor API esté correctamente configurado para responder en la ruta especificada y que la red permita la comunicación entre el ESP32 y el servidor remoto.

---

Este README detalla tanto la estructura del código como su funcionamiento, lo que facilita la comprensión, mantenimiento y futuras modificaciones del proyecto. Puedes personalizarlo y expandirlo de acuerdo a las necesidades específicas de tu implementación o para agregar nuevas funcionalidades.