# **Documentación de Requisitos del Sistema Web de Auditoría Informática (SAI)**

## **1\. Información del Proyecto**

* **Proyecto:** Sistema Web de Auditoría Informática para la Evaluación de la Seguridad de la Información.  
* **Institución:** Contraloría del Municipio Pedraza, Estado Barinas.  
* **Normativa Base:** ISO 27001:2022 y Manual de Normas y Procedimientos en Materia de Auditoría de Estado.

## **2\. Arquitectura Tecnológica (Propuesta)**

* **Entorno de Desarrollo:** Node.js.  
* **Frontend:** React con JavaScript.  
* **Base de Datos y Autenticación:** Firebase (Cloud Firestore, Authentication, Firebase Storage, Cloud Functions para persistencia y escalabilidad).

## **3\. Propósito y Alcance**

### **3.1 Propósito**

Documentar los requisitos funcionales y no funcionales para el desarrollo del SAI, permitiendo automatizar y estandarizar el proceso de auditoría en seguridad de la información bajo la norma ISO 27001:2022 y el marco legal de la Contraloría General de la República.

### **3.2 Alcance del Sistema**

El sistema cubrirá las siguientes áreas funcionales:

| Módulo | Descripción |
| :---- | :---- |
| **Gestión de Usuarios y Roles** | Control de acceso basado en el organigrama institucional con autenticación multifactor (2FA). |
| **Planificación de Auditoría** | Desde la selección del objeto a evaluar hasta la emisión de oficios de designación y acreditación. |
| **Ejecución de Auditoría** | Checklist digital ISO 27001:2022, registro de hallazgos (Condición-Criterio-Causa-Efecto) y gestión de evidencias offline. |
| **Presentación de Resultados** | Generación automática de informes preliminares, definitivos y de seguimiento con firma digital y QR. |
| **Plan de Acciones Correctivas (PAC)** | Gestión del seguimiento a las recomendaciones del informe definitivo. |
| **Alertas y Notificaciones** | Gestión proactiva de plazos, recordatorios y escalamiento de incumplimientos. |
| **Determinación de Responsabilidades** | Vinculación de hallazgos con mérito al proceso administrativo sancionatorio. |

## **4\. Actores del Sistema**

Roles definidos según el Manual de Normas y Procedimientos de Auditoría de Estado:

| Actor | Rol en el Sistema | Responsabilidades |
| :---- | :---- | :---- |
| **Contralor Municipal** | Máxima autoridad | Aprueba y firma informes de alto nivel. |
| **Director General** | Supervisión estratégica | Aprueba acreditaciones, gestiona credenciales y firma oficios de remisión. |
| **Director de Control** | Planificación y supervisión | Designa equipos de trabajo y aprueba programas de trabajo. |
| **Coordinador de Auditoría** | Gestión operativa | Elabora programas, coordina el equipo y genera informes definitivos. |
| **Auditor (Ejecutor)** | Trabajo de campo | Aplica el checklist, registra hallazgos y elabora papeles de trabajo. |
| **Abogado Actuante** | Asesoría legal | Revisa hallazgos y valida evidencias con eficacia probatoria. |
| **Dir. de Det. de Resp.** | Proceso sancionatorio | Inicia procedimientos basados en hallazgos con mérito. |

## **5\. Historias de Usuario (Principales)**

### **Módulo 1: Gestión de Usuarios**

* HU-01: Gestión de Usuarios : Como Director General, quiero crear y asignar roles (RBAC) a los funcionarios para controlar el acceso al sistema. Debe incluir 2FA obligatorio mediante Firebase Auth y una bitácora inalterable de acciones.

### **Módulo 2: Planificación**

* HU-02: Planificar Auditoría : Como Director de Control, quiero iniciar una nueva actuación registrando código único, origen y asignando el equipo auditor.  
* HU-03: Emitir Documentos : Como Coordinador, quiero generar oficios de presentación y acreditación en PDF con QR y firma digital.

### **Módulo 3: Ejecución (ISO 27001\)**

* HU-04: Ejecución Offline : Como Auditor, quiero usar un checklist digital basado en los 93 controles de la ISO 27001:2022 y trabajar sin conexión a internet, sincronizando los datos automáticamente mediante Firestore al recuperar la señal.  
* HU-05: Documentar Hallazgos : Como Auditor, quiero registrar hallazgos estructurados (Condición-Criterio-Causa-Efecto) vinculados a la ISO 27001\.  
* HU-06: Papeles de Trabajo : Como Auditor, quiero subir evidencias a Firebase Storage con referenciación cruzada y generación automática de hash SHA-256 para asegurar la integridad.

## **6\. Especificaciones No Funcionales**

* **Seguridad y Legalidad:** Autenticación Multifactor (2FA) al 100% y cumplimiento con la Ley sobre Mensajes de Datos y Firmas Electrónicas.  
* **Integridad:** Sellado digital de archivos con hash SHA-256 antes de subir a Storage.  
* **Auditabilidad:** Bitácora inalterable (logs) en una colección protegida contra borrado o actualización.  
* **Rendimiento:** Tiempo de carga inferior a 3 segundos y persistencia offline obligatoria para el checklist.

## **7\. Estructura de Datos (Firebase Firestore)**

El modelo no relacional organiza la información en colecciones escalables:

## **erDiagram**

##     **USUARIOS ||--o{ AUDITORIAS : participa**

##     **AUDITORIAS ||--o{ HALLAZGOS : contiene**

##     **AUDITORIAS ||--o{ CHECKLIST\_ISO27001 : evalua**

##     **AUDITORIAS ||--o{ INFORMES : genera**

## 

## **8\. Matriz de Trazabilidad Normativa**

Vinculación de requisitos con el Manual de la CGR y la ISO 27001:

| Requisito / Historia | Manual de Auditoría (CGR) | ISO 27001:2022 |
| :---- | :---- | :---- |
| **HU-01: Gestión de Usuarios** | Organigrama institucional | 5.2 Roles y responsabilidades. |
| **HU-02: Planificar Auditoría** | Norma 1 y 7 | 9.2 Auditoría interna. |
| **HU-04: Checklist ISO 27001** | Anexo 1: Técnicas de auditoría | Anexo A (Controles 5 al 8). |
| **HU-05: Registro de Hallazgos** | Norma 8-10 y Anexo 2 | 9.2.2 Programa de auditoría. |
| **HU-06: Papeles de Trabajo** | Normas específicas (pág. 46-52) | 7.5.3 Control de información. |
| **HU-07: Alertas de Plazos** | Norma 7 y 12 | 9.1 Seguimiento y análisis. |

---

