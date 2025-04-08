# 🩺 Pastillero Automático Inteligente con ESP32  
**Automatiza la administración de medicamentos usando IoT**  

---

## 📝 Descripción  
Este proyecto consiste en un **pastillero automático inteligente** diseñado para dispensar pastillas en horarios programados, utilizando un **ESP32** como controlador principal. El sistema integra un **servomotor de 360°** para liberar las pastillas y un **LED** como indicador visual de alerta. Ideal para mejorar la adherencia a tratamientos médicos, especialmente en adultos mayores o pacientes con enfermedades crónicas.  

![Diagrama del proyecto](https://via.placeholder.com/400x200.png?text=Diagrama+Pastillero+ESP32) *(Reemplazar con imagen real del prototipo)*  

---

## 🚀 Características  
- **Dispensado automático**: Libera pastillas en horarios predefinidos mediante un servomotor de 360°.  
- **Indicador visual**: LED parpadeante para alertar al usuario.  
- **Integración IoT**: Control remoto vía Wi-Fi/Bluetooth (ESP32).  
- **Programación flexible**: Configuración de horarios personalizados mediante interfaz web o aplicación.  
- **Bajo costo**: Componentes accesibles y fáciles de implementar.  

---

## 🛠 Componentes Utilizados  
| Componente          | Especificaciones                          |  
|---------------------|-------------------------------------------|  
| **ESP32**           | Microcontrolador Wi-Fi/Bluetooth          |  
| **Servo SG90 360°** | Motor de rotación continua (5V)           |  
| **LED RGB**         | Indicador visual (rojo/verde/azul)        |  
| **Batería**         | Portador de baterias o batería LiPo (7.4V) |  
| **Estructura**      | Impresión 3D o caja plástica personalizada |  

---

## 🔌 Instalación y Configuración  
### Requisitos  
- IDE Arduino o PlatformIO.  
- Librerías: `ESP32Servo`, `WiFi`, `WebServer` (para control remoto).  

### Pasos  
1. **Conexión de componentes**:  
   - Conecta el servo al pin GPIO `D13` del ESP32.  
   - Conecta el LED al pin `D12` con una resistencia de 220Ω.  
   - Alimenta el circuito con una fuente de 5V.  

2. **Programación del ESP32**:  
   - Configura horarios de dispensación en el código (`horarios[]`).  
   - Personaliza el comportamiento del LED (ej: parpadeo cada 10 segundos).  

   ```cpp
   #include <ESP32Servo.h>
   Servo servo;
   const int pinServo = 13;
   const int pinLED = 12;

   void setup() {
     servo.attach(pinServo);
     pinMode(pinLED, OUTPUT);
   }

   void dispensarPastilla() {
     servo.write(180);  // Gira 180° para liberar la pastilla
     delay(1000);
     servo.write(0);     // Vuelve a la posición inicial
   }
   ```  

3. **Interfaz web (opcional)**:  
   - Usa el módulo Wi-Fi del ESP32 para crear un servidor web local y configurar horarios desde un navegador.  

---

## 🎯 Uso  
1. **Programación de horarios**:  
   - Edita el array `horarios[]` en el código para definir las horas de dispensación (ej: `{"08:00", "14:00", "20:00"}`).  
2. **Activación**:  
   - Enciende el sistema: el LED parpadeará 5 veces al iniciar.  
3. **Alerta activa**:  
   - Cuando sea hora de tomar la pastilla, el LED se encenderá en rojo y el servo girará para liberar la dosis.  

---

## 📂 Estructura del Código  
```plaintext
/  
├── src/  
│   ├── main.cpp           # Lógica principal  
│   └── config.h           # Configuración de horarios y pines  
├── lib/  
│   └── ESP32Servo/        # Librería para control del servo  
├── docs/  
│   └── diagrama.pdf       # Esquema de conexiones  
└── README.md              # Este archivo  
```  

---

## 🤝 Contribuir  
¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto:  
1. Haz un fork del repositorio.  
2. Crea una rama: `git checkout -b nueva-funcionalidad`.  
3. Realiza tus cambios y haz commit: `git commit -m 'Añade X feature'`.  
4. Haz push a la rama: `git push origin nueva-funcionalidad`.  
5. Abre un Pull Request.  

---

## 📜 Licencia  
Este proyecto está bajo la licencia **MIT**. Más detalles en [LICENSE](LICENSE).  

---

## ✉️ Contacto  
¿Preguntas o sugerencias? ¡Escríbeme!  
- 📧 Email: tucorreo@ejemplo.com  
- 🌐 GitHub: [@tuusuario](https://github.com/tuusuario)  

---

**¡Gracias por tu interés en el proyecto!** 💊🤖  

--- 

Este formato es estándar para documentar proyectos técnicos en GitHub/GitLab. Incluye secciones clave como instalación, uso, componentes y estructura de código. Si necesitas profundizar en algún apartado (ej: esquemáticos electrónicos), ¡avísame! 😊