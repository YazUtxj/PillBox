# FRs (Functional requirements) ![FRs](https://img.shields.io/badge/Microsoft_Word-2B579A?style=for-the-badge&logo=microsoft-word&logoColor=white)

En esta seccion encontraremos el apartado de los requisitos funcionales de la aplicacion web ,detallando de lo que el sistema debe hacer desde una perspectiva funcional.
1.	**Gestión de Usuarios**:
 - &nbsp;Registro e inicio de sesión de usuarios en la aplicación.
 - &nbsp;Permitir la configuración de perfil de paciente.
2.	**Configuración de Medicación**:
 - &nbsp;Programación de horarios y dosis de cada medicamento.
 - &nbsp;Posibilidad de modificar y eliminar horarios.
3.	**Dispensación de Medicamentos**:
 - &nbsp;Activación automática del mecanismo dispensador en la hora programada.
  - &nbsp;Registro de cada dispensación en la base de datos.
4.	**Alertas y Notificaciones**:
  - &nbsp;Generación de alertas visuales (LEDs) y sonoras (buzzer) en la botella.
  - &nbsp;Envío de notificaciones a la aplicación móvil y dashboard web.
5.	**Monitoreo y Reportes**:
  - &nbsp;Visualización del historial de administración de medicamentos.
  - &nbsp;Generación de reportes sobre el cumplimiento del tratamiento.
6.	**Conectividad y Sincronización**:
  - &nbsp;Comunicación entre el ESP32 y la aplicación móvil mediante Wi-Fi/Bluetooth.
 - &nbsp;Sincronización en tiempo real con el servidor para actualización de datos.


## Estructura de Archivos
>PillBox<br>
>| - Backend <br>
>| - Database<br>
>| - **Documentation**<br>
> &nbsp;&nbsp;|- BRs<br>
> &nbsp;&nbsp;|- **FRs**<br>
> &nbsp;&nbsp;|- GUI<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- Mockups<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- Prototype<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- SisteMap<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- Sketches<br>
> &nbsp;&nbsp;&nbsp;&nbsp;|- Wireframes<br>
> &nbsp;&nbsp;|- Installation<br>
> &nbsp;&nbsp;|- Manual<br>
> &nbsp;&nbsp;|- NFRs<br>
> &nbsp;&nbsp;|- UHs<br>
> &nbsp;&nbsp;|- UserManual<br>
>| - FrontEnd <br>
>| - Iot<br>

|Integrante|Contacto|Rol|Observaciones|
|------------|--------|---|---|
|Yazmin Gutierrez Hernandez|[@YazUtxj](https://github.com/YazUtxj)|Documentador, FrontEnd, Base de Datos||
|Diego Miguel Rivera Chavez|[@DiegoMiguel04](https://github.com/DiegoMiguel04)|Backend, IoT, FrontEnd| |
|Citlalli Perez Dinicio|[@KouDionicio](https://github.com/KouDionicio)|Base de Datos, Backend| |
|Erick Matias Granillo Mejia|[@Ematias230045](https://github.com/Ematias230045)|IoT, Backend| |
|Jennifer Bautista Barrios|[@JenniferBautistaBarrios](https://github.com/JenniferBautistaBarrios)|FrontEnd, Documentador| |