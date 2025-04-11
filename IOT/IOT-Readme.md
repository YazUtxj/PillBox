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

## Colaboradoes

| Nombre                        | Usuario             | Roles |
|-------------------------------|---------------------|--------|
| Yazmin Gutierrez Hernandez  | [YazUtxj](https://github.com/YazUtxj)        | Documentador , FronEnd,  Base de Datos       |
| Diego Miguel Rivera Chavez          | [DiegoMiguel04](https://github.com/DiegoMiguel04)       |  Backend, Iot , FronEnd     |
| Citlalli Pérez Dionicio         | [KouDionicio](https://github.com/KouDionicio)             |  Base de Datos ,Backend     |
|  Erick Matias Granillo Mejia           | [Ematias230045](https://github.com/Ematias230045)            | Iot ,Backend     |
| Jennifer Bautista Barrios           |[JenniferBautistaBarrios](https://github.com/JenniferBautistaBarrios)            | FronEnd , Documentador      |