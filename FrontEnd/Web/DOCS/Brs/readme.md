# Business Rules (BRs) 
![BRs](https://img.shields.io/badge/Requerimientos-BRs-6A1B9A?style=flat&logo=bookstack&logoColor=white)


## Descripción  
Este documento contiene las **Reglas de Negocio (BRs)** que gobiernan el funcionamiento del sistema **PILLBOX**, asegurando consistencia, seguridad y cumplimiento de los objetivos del proyecto.  

---

## Estructura de la Documentación  
El archivo principal (`BRs_PILLBOX.docx`) se encuentra en la carpeta `DOCS/BRs` y está organizado en las siguientes secciones:  

1. **Introducción**  
   - Propósito del documento.  
   - Alcance del sistema.  

2. **Reglas Generales**  
   - Precisión en la gestión de medicamentos.  
   - Privacidad de los datos del usuario (cumplimiento de normativas locales).  
   - Responsabilidad en notificaciones y alertas.  

3. **Reglas Específicas**  
   - Horarios de medicación: Máximo de 10 alertas diarias configuradas.  
   - Interfaz de usuario: Diseño accesible (contraste alto, fuentes legibles).  
   - Integración con hardware: Validación de conexión ESP32 antes de enviar alertas.  

4. **Flujos de Excepción**  
   - Manejo de fallos en la conectividad WiFi/BT.  
   - Protocolo para medicamentos omitidos o dosis incorrectas.  

---

## Acceso y Actualización  
- **Formato**: Documento editable en Microsoft Word (.docx).  
- **Versionado**: Los cambios deben registrarse en el historial de revisiones del archivo.  
- **Contribuciones**: Cualquier modificación debe ser aprobada por el equipo técnico y documentada en [UHs](DOCS/UHs).  

---

## Reglas Clave ⚙️  
| Regla ID | Descripción | Prioridad |  
|----------|-------------|-----------|  
| BR-001 | El sistema debe notificar al usuario y a su cuidador (vía app) ante una dosis omitida. | Alta |  
| BR-002 | La botella debe bloquearse físicamente fuera de los horarios programados. | Media |  
| BR-003 | Los datos de salud del usuario nunca se compartirán con terceros sin consentimiento explícito. | Crítica |  
| BR-004 | La aplicación móvil debe funcionar offline con sincronización posterior. | Alta |  

---

## Relación con Otros Documentos  
- **Requisitos Funcionales (FRs)**: [Ver aquí](DOCS/FRs).  
- **Roles de Usuario**: [Ver aquí](DOCS/UserRoles).  
- **Requisitos No Funcionales (NFRs)**: [Ver aquí](DOCS/NFRs).  

---

⚠️ **Nota**: Las BRs son dinámicas y pueden evolucionar según los avances del proyecto.  


## Estructura de Carpetas del Proyecto

>PillBox<br>
>| - Backend <br>
>| - Databases<br>
>| - Documentation<br>
>| - **FrontEnd** <br>
> &nbsp;&nbsp;|- ASSETS<br>
> &nbsp;&nbsp;|- CSS<br>
> &nbsp;&nbsp;|- **DOCS**<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- **BRs**<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- FRs<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- GUI<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- NFRs<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- UHs<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- UserRoles<br>
> &nbsp;&nbsp;|- HTML<br>
> &nbsp;&nbsp;|- JS<br>


## Integrantes del Proyecto

|Integrante|Contacto|Rol|Observaciones|
|------------|--------|---|---|
|Yazmin Gutierrez Hernandez|[@YazUtxj](https://github.com/YazUtxj)|Documentador, FrontEnd, Base de Datos|Sin observaciones ✅|
|Diego Miguel Rivera Chavez|[@DiegoMiguel04](https://github.com/DiegoMiguel04)|Backend, IoT, FrontEnd|Sin observaciones ✅|
|Citlalli Perez Dionicio |[@KouDionicio](https://github.com/KouDionicio)|Base de Datos, Backend|Sin observaciones ✅|
|Erick Matias Granillo Mejia|[@Ematias230045](https://github.com/Ematias230045)|IoT, Backend|Sin observaciones ✅|
|Jennifer Bautista Barrios|[@JenniferBautistaBarrios](https://github.com/JenniferBautistaBarrios)|FrontEnd, Documentador|Sin observaciones ✅|