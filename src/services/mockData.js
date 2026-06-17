// Datos de demostración para el Sistema de Auditoría Informática (SAI)

export const mockUsers = [
  { id: '1', name: 'Jose Alexander Jimenez Devia', role: 'Contralor Municipal', email: 'contraloria_pedraza@hotmail.com', avatar: 'JA', status: 'Activo', twoFactorEnabled: true, createdAt: '2025-01-15' },
  { id: '2', name: 'Ana Silva', role: 'Director General', email: 'asilva@cmp.gob.ve', avatar: 'AS', status: 'Activo', twoFactorEnabled: true, createdAt: '2025-02-01' },
  { id: '3', name: 'Luis Ramos', role: 'Director de Control', email: 'lramos@cmp.gob.ve', avatar: 'LR', status: 'Activo', twoFactorEnabled: false, createdAt: '2025-03-10' },
  { id: '4', name: 'María Gonzalez', role: 'Coordinador de Auditoría', email: 'mgonzalez@cmp.gob.ve', avatar: 'MG', status: 'Inactivo', twoFactorEnabled: false, createdAt: '2025-04-20' },
  { id: '5', name: 'José Pérez', role: 'Auditor', email: 'jperez@cmp.gob.ve', avatar: 'JP', status: 'Activo', twoFactorEnabled: true, createdAt: '2025-05-05' },
  { id: '6', name: 'Laura Gómez', role: 'Abogado Actuante', email: 'lgomez@cmp.gob.ve', avatar: 'LG', status: 'Activo', twoFactorEnabled: false, createdAt: '2026-01-10' },
  { id: '7', name: 'Pedro Díaz', role: 'Dir. de Det. de Resp.', email: 'pdiaz@cmp.gob.ve', avatar: 'PD', status: 'Activo', twoFactorEnabled: true, createdAt: '2026-02-15' }
];

export const mockAudits = [
  {
    id: 'AUD-2026-001',
    title: 'Evaluación de Seguridad BD',
    organism: 'Alcaldía de Pedraza',
    status: 'in-progress',
    progress: 45,
    startDate: '2026-04-15',
    endDate: '2026-05-30',
    team: ['4', '5'],
    priority: 'Alta',
    tasks: { total: 24, completed: 11 }
  },
  {
    id: 'AUD-2026-002',
    title: 'Auditoría Redes Internas',
    organism: 'Concejo Municipal',
    status: 'review',
    progress: 90,
    startDate: '2026-03-01',
    endDate: '2026-05-10',
    team: ['3', '4'],
    priority: 'Media',
    tasks: { total: 15, completed: 14 }
  },
  {
    id: 'AUD-2026-003',
    title: 'Planificación Anual SO',
    organism: 'Contraloría Municipal',
    status: 'open',
    progress: 0,
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    team: ['2', '3'],
    priority: 'Baja',
    tasks: { total: 30, completed: 0 }
  },
  {
    id: 'AUD-2026-004',
    title: 'Revisión PAC 2025',
    organism: 'Alcaldía de Pedraza',
    status: 'closed',
    progress: 100,
    startDate: '2026-01-10',
    endDate: '2026-02-28',
    team: ['5'],
    priority: 'Alta',
    tasks: { total: 10, completed: 10 }
  }
];

export const mockChecklist = [
  // ═══════════════════════════════════════════════════════════════
  // CONTROLES ORGANIZACIONALES (37 controles) — Cláusula 5
  // ═══════════════════════════════════════════════════════════════
  {
    id: '5.1',
    category: 'Organizacionales',
    title: 'Políticas para la seguridad de la información',
    description: 'La política de seguridad de la información y las políticas específicas del tema deben ser definidas, aprobadas por la dirección, publicadas, comunicadas y reconocidas por los empleados relevantes.',
    status: null,
    observations: ''
  },
  {
    id: '5.2',
    category: 'Organizacionales',
    title: 'Roles y responsabilidades en seguridad de la información',
    description: 'Todas las responsabilidades de seguridad de la información deben ser definidas y asignadas de acuerdo con las necesidades de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '5.3',
    category: 'Organizacionales',
    title: 'Segregación de tareas',
    description: 'Las tareas y áreas de responsabilidad en conflicto deben ser segregadas para reducir la oportunidad de modificación no autorizada o uso indebido de los activos de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '5.4',
    category: 'Organizacionales',
    title: 'Responsabilidades de la dirección',
    description: 'La dirección debe exigir a todos los empleados y contratistas que apliquen la seguridad de la información de acuerdo con las políticas y procedimientos establecidos.',
    status: null,
    observations: ''
  },
  {
    id: '5.5',
    category: 'Organizacionales',
    title: 'Contacto con las autoridades',
    description: 'Se deben establecer y mantener contactos apropiados con las autoridades relevantes (fuerzas del orden, organismos reguladores, servicios de emergencia).',
    status: null,
    observations: ''
  },
  {
    id: '5.6',
    category: 'Organizacionales',
    title: 'Contacto con grupos de interés especial',
    description: 'Se deben establecer y mantener contactos con grupos de interés especial, foros de especialistas en seguridad y asociaciones profesionales.',
    status: null,
    observations: ''
  },
  {
    id: '5.7',
    category: 'Organizacionales',
    title: 'Inteligencia de amenazas',
    description: 'La información relacionada con las amenazas de seguridad de la información debe ser recolectada y analizada para producir inteligencia de amenazas.',
    status: null,
    observations: ''
  },
  {
    id: '5.8',
    category: 'Organizacionales',
    title: 'Seguridad de la información en la gestión de proyectos',
    description: 'La seguridad de la información debe integrarse en la gestión de proyectos, independientemente del tipo de proyecto.',
    status: null,
    observations: ''
  },
  {
    id: '5.9',
    category: 'Organizacionales',
    title: 'Inventario de información y otros activos asociados',
    description: 'Se debe desarrollar y mantener un inventario de información y otros activos asociados, incluyendo sus propietarios.',
    status: null,
    observations: ''
  },
  {
    id: '5.10',
    category: 'Organizacionales',
    title: 'Uso aceptable de la información y activos asociados',
    description: 'Se deben identificar, documentar e implementar reglas para el uso aceptable y procedimientos para el manejo de información y otros activos asociados.',
    status: null,
    observations: ''
  },
  {
    id: '5.11',
    category: 'Organizacionales',
    title: 'Devolución de activos',
    description: 'Todo el personal y las partes externas deben devolver todos los activos de la organización que estén en su posesión al finalizar su empleo, contrato o acuerdo.',
    status: null,
    observations: ''
  },
  {
    id: '5.12',
    category: 'Organizacionales',
    title: 'Clasificación de la información',
    description: 'La información debe ser clasificada de acuerdo con las necesidades de seguridad de la información de la organización, basándose en la confidencialidad, integridad, disponibilidad y requisitos de las partes interesadas.',
    status: null,
    observations: ''
  },
  {
    id: '5.13',
    category: 'Organizacionales',
    title: 'Etiquetado de la información',
    description: 'Se debe desarrollar e implementar un conjunto apropiado de procedimientos para el etiquetado de la información, de acuerdo con el esquema de clasificación adoptado.',
    status: null,
    observations: ''
  },
  {
    id: '5.14',
    category: 'Organizacionales',
    title: 'Transferencia de la información',
    description: 'Se deben establecer reglas, procedimientos o acuerdos de transferencia de información para todos los tipos de instalaciones de transferencia dentro de la organización y entre la organización y otras partes.',
    status: null,
    observations: ''
  },
  {
    id: '5.15',
    category: 'Organizacionales',
    title: 'Control de acceso',
    description: 'Se deben establecer e implementar reglas para controlar el acceso físico y lógico a la información y otros activos asociados, basándose en los requisitos del negocio y de seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '5.16',
    category: 'Organizacionales',
    title: 'Gestión de identidad',
    description: 'El ciclo de vida completo de las identidades debe ser gestionado, incluyendo el registro, la verificación y la eliminación de identidades de usuario.',
    status: null,
    observations: ''
  },
  {
    id: '5.17',
    category: 'Organizacionales',
    title: 'Información de autenticación',
    description: 'La asignación y gestión de la información de autenticación debe ser controlada por un proceso de gestión, incluyendo el asesoramiento al personal sobre el manejo apropiado de la información de autenticación.',
    status: null,
    observations: ''
  },
  {
    id: '5.18',
    category: 'Organizacionales',
    title: 'Derechos de acceso',
    description: 'Los derechos de acceso a la información y otros activos asociados deben ser aprovisionados, revisados, modificados y eliminados de acuerdo con las políticas y reglas de control de acceso de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '5.19',
    category: 'Organizacionales',
    title: 'Seguridad de la información en las relaciones con proveedores',
    description: 'Se deben definir e implementar procesos y procedimientos para gestionar los riesgos de seguridad de la información asociados con el uso de los productos o servicios del proveedor.',
    status: null,
    observations: ''
  },
  {
    id: '5.20',
    category: 'Organizacionales',
    title: 'Abordar la seguridad dentro de los acuerdos de proveedores',
    description: 'Se deben establecer y acordar con cada proveedor los requisitos pertinentes de seguridad de la información, de acuerdo con el tipo de relación con el proveedor.',
    status: null,
    observations: ''
  },
  {
    id: '5.21',
    category: 'Organizacionales',
    title: 'Seguridad en la cadena de suministro de las TIC',
    description: 'Se deben definir e implementar procesos y procedimientos para gestionar los riesgos de seguridad de la información asociados con la cadena de suministro de productos y servicios de TIC.',
    status: null,
    observations: ''
  },
  {
    id: '5.22',
    category: 'Organizacionales',
    title: 'Gestión del cambio de los servicios de proveedores',
    description: 'Los cambios en las prácticas de seguridad de la información de los proveedores y la prestación de servicios deben ser gestionados, considerando la criticidad de la información del negocio y los sistemas y procesos involucrados.',
    status: null,
    observations: ''
  },
  {
    id: '5.23',
    category: 'Organizacionales',
    title: 'Seguridad para el uso de servicios en la nube',
    description: 'Se deben establecer procesos para la adquisición, uso, gestión y salida de los servicios en la nube, de acuerdo con los requisitos de seguridad de la información de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '5.24',
    category: 'Organizacionales',
    title: 'Planificación de la gestión de incidentes',
    description: 'La organización debe planificar y prepararse para la gestión de incidentes de seguridad de la información, definiendo, estableciendo y comunicando procesos, roles y responsabilidades de gestión de incidentes.',
    status: null,
    observations: ''
  },
  {
    id: '5.25',
    category: 'Organizacionales',
    title: 'Evaluación y decisión sobre eventos de seguridad',
    description: 'La organización debe evaluar los eventos de seguridad de la información y decidir si deben ser categorizados como incidentes de seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '5.26',
    category: 'Organizacionales',
    title: 'Respuesta a incidentes de seguridad de la información',
    description: 'Los incidentes de seguridad de la información deben ser respondidos de acuerdo con los procedimientos documentados.',
    status: null,
    observations: ''
  },
  {
    id: '5.27',
    category: 'Organizacionales',
    title: 'Aprender de los incidentes de seguridad',
    description: 'El conocimiento obtenido de los incidentes de seguridad de la información debe usarse para fortalecer y mejorar los controles de seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '5.28',
    category: 'Organizacionales',
    title: 'Recopilación de evidencias',
    description: 'La organización debe establecer e implementar procedimientos para la identificación, recopilación, adquisición y preservación de evidencias relacionadas con eventos de seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '5.29',
    category: 'Organizacionales',
    title: 'Seguridad de la información durante la interrupción',
    description: 'La organización debe planificar cómo mantener la seguridad de la información a un nivel apropiado durante la interrupción.',
    status: null,
    observations: ''
  },
  {
    id: '5.30',
    category: 'Organizacionales',
    title: 'Preparación de las TIC para la continuidad del negocio',
    description: 'La preparación de las TIC debe ser planificada, implementada, mantenida y probada en función de los objetivos de continuidad del negocio y los requisitos de continuidad de las TIC.',
    status: null,
    observations: ''
  },
  {
    id: '5.31',
    category: 'Organizacionales',
    title: 'Identificación de requisitos legales y contractuales',
    description: 'Los requisitos legales, estatutarios, regulatorios y contractuales relevantes para la seguridad de la información y el enfoque de la organización para cumplirlos deben ser identificados, documentados y mantenidos actualizados.',
    status: null,
    observations: ''
  },
  {
    id: '5.32',
    category: 'Organizacionales',
    title: 'Derechos de propiedad intelectual (DPI)',
    description: 'La organización debe implementar procedimientos apropiados para proteger los derechos de propiedad intelectual, incluyendo el uso de software propietario y licenciamiento.',
    status: null,
    observations: ''
  },
  {
    id: '5.33',
    category: 'Organizacionales',
    title: 'Protección de los registros',
    description: 'Los registros deben ser protegidos contra pérdida, destrucción, falsificación, acceso no autorizado y publicación no autorizada.',
    status: null,
    observations: ''
  },
  {
    id: '5.34',
    category: 'Organizacionales',
    title: 'Privacidad y protección de datos de carácter personal',
    description: 'La organización debe identificar y cumplir los requisitos relativos a la preservación de la privacidad y la protección de los datos de carácter personal según las leyes y regulaciones aplicables y los requisitos contractuales.',
    status: null,
    observations: ''
  },
  {
    id: '5.35',
    category: 'Organizacionales',
    title: 'Revisión independiente de la seguridad',
    description: 'El enfoque de la organización para gestionar la seguridad de la información y su implementación, incluyendo las personas, procesos y tecnologías, debe ser revisado de forma independiente a intervalos planificados o cuando ocurran cambios significativos.',
    status: null,
    observations: ''
  },
  {
    id: '5.36',
    category: 'Organizacionales',
    title: 'Cumplimiento de políticas y normas de seguridad',
    description: 'Se debe revisar periódicamente el cumplimiento de las políticas de seguridad de la información, las reglas y las normas de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '5.37',
    category: 'Organizacionales',
    title: 'Documentación de procedimientos operacionales',
    description: 'Los procedimientos operacionales para las instalaciones de procesamiento de información deben ser documentados y puestos a disposición del personal que los necesite.',
    status: null,
    observations: ''
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTROL DE PERSONAS (8 controles) — Cláusula 6
  // ═══════════════════════════════════════════════════════════════
  {
    id: '6.1',
    category: 'Personas',
    title: 'Comprobación de antecedentes',
    description: 'Se deben realizar verificaciones de antecedentes para todos los candidatos a empleo de acuerdo con las leyes relevantes, regulaciones y la ética, y deben ser proporcionales a los requisitos del negocio, la clasificación de la información a la que se va a acceder y los riesgos percibidos.',
    status: null,
    observations: ''
  },
  {
    id: '6.2',
    category: 'Personas',
    title: 'Términos y condiciones de contratación',
    description: 'Los acuerdos contractuales con empleados y contratistas deben establecer sus responsabilidades y las de la organización respecto a la seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '6.3',
    category: 'Personas',
    title: 'Concienciación, educación y formación',
    description: 'El personal de la organización y las partes interesadas pertinentes deben recibir concienciación, educación y formación adecuadas en seguridad de la información, así como actualizaciones periódicas de las políticas y procedimientos de la organización que sean relevantes para su función laboral.',
    status: null,
    observations: ''
  },
  {
    id: '6.4',
    category: 'Personas',
    title: 'Proceso disciplinario',
    description: 'Se debe establecer y comunicar un proceso disciplinario formal para tomar medidas contra el personal y otras partes interesadas que hayan cometido una violación de la política de seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '6.5',
    category: 'Personas',
    title: 'Responsabilidad ante la finalización o cambio',
    description: 'Las responsabilidades y obligaciones de seguridad de la información que sigan siendo válidas después de la finalización o el cambio de empleo deben definirse, aplicarse y comunicarse al personal y a otras partes interesadas pertinentes.',
    status: null,
    observations: ''
  },
  {
    id: '6.6',
    category: 'Personas',
    title: 'Acuerdos de confidencialidad o no divulgación',
    description: 'Los acuerdos de confidencialidad o no divulgación que reflejen las necesidades de la organización para la protección de la información deben ser identificados, documentados, revisados periódicamente y firmados por el personal y otras partes interesadas pertinentes.',
    status: null,
    observations: ''
  },
  {
    id: '6.7',
    category: 'Personas',
    title: 'Teletrabajo',
    description: 'Se deben implementar medidas de seguridad cuando el personal trabaje de forma remota para proteger la información accedida, procesada o almacenada fuera de las instalaciones de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '6.8',
    category: 'Personas',
    title: 'Notificación de eventos de seguridad de la información',
    description: 'La organización debe proporcionar un mecanismo para que el personal informe los eventos de seguridad de la información observados o sospechados a través de los canales apropiados de manera oportuna.',
    status: null,
    observations: ''
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTROLES FÍSICOS (14 controles) — Cláusula 7
  // ═══════════════════════════════════════════════════════════════
  {
    id: '7.1',
    category: 'Físicos',
    title: 'Perímetro de seguridad física',
    description: 'Los perímetros de seguridad deben definirse y utilizarse para proteger áreas que contienen información y otros activos asociados.',
    status: null,
    observations: ''
  },
  {
    id: '7.2',
    category: 'Físicos',
    title: 'Controles físicos de entrada',
    description: 'Las áreas seguras deben estar protegidas por controles de entrada adecuados para asegurar que solo el personal autorizado tenga acceso.',
    status: null,
    observations: ''
  },
  {
    id: '7.3',
    category: 'Físicos',
    title: 'Seguridad de oficinas, despachos y recursos',
    description: 'Se debe diseñar y aplicar la seguridad física para oficinas, despachos e instalaciones, considerando las amenazas a la seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '7.4',
    category: 'Físicos',
    title: 'Monitorización de la seguridad física',
    description: 'Las instalaciones deben ser monitorizadas continuamente para detectar acceso físico no autorizado, incluyendo el uso de sistemas de vigilancia y alarmas.',
    status: null,
    observations: ''
  },
  {
    id: '7.5',
    category: 'Físicos',
    title: 'Protección contra amenazas físicas y ambientales',
    description: 'Se debe diseñar y aplicar protección contra amenazas físicas y ambientales, como desastres naturales y otras amenazas físicas intencionadas o no intencionadas a la infraestructura.',
    status: null,
    observations: ''
  },
  {
    id: '7.6',
    category: 'Físicos',
    title: 'El trabajo en áreas seguras',
    description: 'Se deben diseñar y aplicar medidas de seguridad para el trabajo en áreas seguras, controlando los puntos de acceso y las actividades dentro de ellas.',
    status: null,
    observations: ''
  },
  {
    id: '7.7',
    category: 'Físicos',
    title: 'Puesto de trabajo despejado y pantalla limpia',
    description: 'Se deben definir y aplicar adecuadamente reglas de escritorio despejado para papeles y soportes de almacenamiento extraíbles, y reglas de pantalla limpia para las instalaciones de procesamiento de información.',
    status: null,
    observations: ''
  },
  {
    id: '7.8',
    category: 'Físicos',
    title: 'Emplazamiento y protección de equipos',
    description: 'Los equipos deben situarse y protegerse para reducir los riesgos de amenazas y peligros ambientales, y las oportunidades de acceso no autorizado.',
    status: null,
    observations: ''
  },
  {
    id: '7.9',
    category: 'Físicos',
    title: 'Seguridad de los equipos fuera de las instalaciones',
    description: 'Se deben aplicar medidas de seguridad a los activos fuera de las instalaciones, teniendo en cuenta los diferentes riesgos de trabajar fuera de las instalaciones de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '7.10',
    category: 'Físicos',
    title: 'Soportes de almacenamiento',
    description: 'Los soportes de almacenamiento deben ser gestionados a lo largo de su ciclo de vida de adquisición, uso, transporte y eliminación, de acuerdo con el esquema de clasificación y los requisitos de manejo de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '7.11',
    category: 'Físicos',
    title: 'Instalaciones de suministro',
    description: 'Las instalaciones de procesamiento de información deben ser protegidas contra cortes de energía y otras interrupciones causadas por fallos en las instalaciones de suministro.',
    status: null,
    observations: ''
  },
  {
    id: '7.12',
    category: 'Físicos',
    title: 'Seguridad del cableado',
    description: 'Los cables de energía y de telecomunicaciones que transportan datos o soportan servicios de información deben ser protegidos contra interceptaciones, interferencias o daños.',
    status: null,
    observations: ''
  },
  {
    id: '7.13',
    category: 'Físicos',
    title: 'Mantenimiento de los equipos',
    description: 'Los equipos deben recibir un mantenimiento correcto para asegurar la disponibilidad, integridad y confidencialidad continua de la información.',
    status: null,
    observations: ''
  },
  {
    id: '7.14',
    category: 'Físicos',
    title: 'Eliminación o reutilización segura de equipos',
    description: 'Los elementos de equipos que contengan soportes de almacenamiento deben ser verificados para asegurar que cualquier dato sensible y software con licencia haya sido eliminado o sobrescrito de forma segura antes de su eliminación o reutilización.',
    status: null,
    observations: ''
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTROLES TECNOLÓGICOS (34 controles) — Cláusula 8
  // ═══════════════════════════════════════════════════════════════
  {
    id: '8.1',
    category: 'Tecnológicos',
    title: 'Dispositivos finales de usuario',
    description: 'La información almacenada, procesada o accesible a través de dispositivos finales de usuario debe estar protegida.',
    status: null,
    observations: ''
  },
  {
    id: '8.2',
    category: 'Tecnológicos',
    title: 'Gestión de privilegios de acceso',
    description: 'La asignación y el uso de los derechos de acceso privilegiado deben ser restringidos y gestionados.',
    status: null,
    observations: ''
  },
  {
    id: '8.3',
    category: 'Tecnológicos',
    title: 'Restricción del acceso a la información',
    description: 'El acceso a la información y otros activos asociados debe ser restringido de acuerdo con la política específica del tema sobre control de acceso.',
    status: null,
    observations: ''
  },
  {
    id: '8.4',
    category: 'Tecnológicos',
    title: 'Acceso al código fuente',
    description: 'El acceso de lectura y escritura al código fuente, herramientas de desarrollo y bibliotecas de software debe ser gestionado adecuadamente.',
    status: null,
    observations: ''
  },
  {
    id: '8.5',
    category: 'Tecnológicos',
    title: 'Autenticación segura',
    description: 'Se deben implementar tecnologías y procedimientos de autenticación segura basados en las restricciones de acceso a la información y la política específica del tema sobre control de acceso.',
    status: null,
    observations: ''
  },
  {
    id: '8.6',
    category: 'Tecnológicos',
    title: 'Gestión de capacidades',
    description: 'El uso de los recursos debe ser monitoreado y ajustado de acuerdo con los requisitos actuales y esperados de capacidad.',
    status: null,
    observations: ''
  },
  {
    id: '8.7',
    category: 'Tecnológicos',
    title: 'Controles contra el código malicioso',
    description: 'Se deben implementar controles de detección, prevención y recuperación para proteger contra el código malicioso, combinados con una adecuada concienciación del usuario.',
    status: null,
    observations: ''
  },
  {
    id: '8.8',
    category: 'Tecnológicos',
    title: 'Gestión de vulnerabilidades técnicas',
    description: 'Debe obtenerse información sobre las vulnerabilidades técnicas de los sistemas de información que se están utilizando, evaluar la exposición de la organización a dichas vulnerabilidades y tomar medidas apropiadas.',
    status: null,
    observations: ''
  },
  {
    id: '8.9',
    category: 'Tecnológicos',
    title: 'Gestión de la configuración',
    description: 'Las configuraciones, incluyendo las configuraciones de seguridad, del hardware, software, servicios y redes deben ser establecidas, documentadas, implementadas, monitorizadas y revisadas.',
    status: null,
    observations: ''
  },
  {
    id: '8.10',
    category: 'Tecnológicos',
    title: 'Eliminación de la información',
    description: 'La información almacenada en sistemas de información, dispositivos o en cualquier otro soporte de almacenamiento debe ser eliminada cuando ya no sea necesaria.',
    status: null,
    observations: ''
  },
  {
    id: '8.11',
    category: 'Tecnológicos',
    title: 'Enmascaramiento de datos',
    description: 'El enmascaramiento de datos debe usarse de acuerdo con la política específica del tema de la organización sobre control de acceso y otros requisitos específicos del tema relacionados, y los requisitos del negocio, teniendo en cuenta la legislación aplicable.',
    status: null,
    observations: ''
  },
  {
    id: '8.12',
    category: 'Tecnológicos',
    title: 'Prevención de fugas de datos',
    description: 'Se deben aplicar medidas de prevención de fugas de datos a los sistemas, redes y cualquier otro dispositivo que procese, almacene o transmita información sensible.',
    status: null,
    observations: ''
  },
  {
    id: '8.13',
    category: 'Tecnológicos',
    title: 'Copias de seguridad de la información',
    description: 'Se deben mantener y probar periódicamente copias de seguridad de la información, el software y los sistemas, de acuerdo con la política específica del tema acordada sobre copias de seguridad.',
    status: null,
    observations: ''
  },
  {
    id: '8.14',
    category: 'Tecnológicos',
    title: 'Redundancia de recursos de tratamiento',
    description: 'Los recursos de tratamiento de la información deben implementarse con la redundancia suficiente para cumplir los requisitos de disponibilidad.',
    status: null,
    observations: ''
  },
  {
    id: '8.15',
    category: 'Tecnológicos',
    title: 'Registros de eventos',
    description: 'Se deben producir, almacenar, proteger y analizar los registros que registren actividades, excepciones, fallos y otros eventos relevantes.',
    status: null,
    observations: ''
  },
  {
    id: '8.16',
    category: 'Tecnológicos',
    title: 'Seguimiento de actividades',
    description: 'Las redes, sistemas e instalaciones de procesamiento de información deben ser monitorizados para detectar comportamientos anómalos y tomar las acciones adecuadas para evaluar los posibles incidentes de seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '8.17',
    category: 'Tecnológicos',
    title: 'Sincronización del reloj',
    description: 'Los relojes de todos los sistemas de procesamiento de información relevantes dentro de la organización o dominio de seguridad deben ser sincronizados a una fuente de tiempo de referencia aprobada.',
    status: null,
    observations: ''
  },
  {
    id: '8.18',
    category: 'Tecnológicos',
    title: 'Uso de programas de utilidad con privilegios',
    description: 'El uso de programas de utilidad que puedan ser capaces de anular los controles del sistema y de la aplicación debe ser restringido y estrictamente controlado.',
    status: null,
    observations: ''
  },
  {
    id: '8.19',
    category: 'Tecnológicos',
    title: 'Instalación de software en sistemas en producción',
    description: 'Se deben implementar procedimientos y medidas para gestionar de forma segura la instalación de software en los sistemas operativos.',
    status: null,
    observations: ''
  },
  {
    id: '8.20',
    category: 'Tecnológicos',
    title: 'Seguridad de redes',
    description: 'Las redes y los dispositivos de red deben ser asegurados, gestionados y controlados para proteger la información en los sistemas y aplicaciones.',
    status: null,
    observations: ''
  },
  {
    id: '8.21',
    category: 'Tecnológicos',
    title: 'Seguridad de los servicios de red',
    description: 'Se deben identificar, implementar y monitorizar los mecanismos de seguridad, los niveles de servicio y los requisitos de servicio de los servicios de red.',
    status: null,
    observations: ''
  },
  {
    id: '8.22',
    category: 'Tecnológicos',
    title: 'Segregación en redes',
    description: 'Los grupos de servicios de información, usuarios y sistemas de información deben estar segregados en las redes de la organización.',
    status: null,
    observations: ''
  },
  {
    id: '8.23',
    category: 'Tecnológicos',
    title: 'Filtrado de webs',
    description: 'El acceso a sitios web externos debe ser gestionado para reducir la exposición a contenido malicioso.',
    status: null,
    observations: ''
  },
  {
    id: '8.24',
    category: 'Tecnológicos',
    title: 'Uso de la criptografía',
    description: 'Se deben definir e implementar reglas para el uso efectivo de la criptografía, incluyendo la gestión de claves criptográficas.',
    status: null,
    observations: ''
  },
  {
    id: '8.25',
    category: 'Tecnológicos',
    title: 'Seguridad en el ciclo de vida del desarrollo',
    description: 'Se deben establecer y aplicar reglas para el desarrollo seguro de software y sistemas.',
    status: null,
    observations: ''
  },
  {
    id: '8.26',
    category: 'Tecnológicos',
    title: 'Requisitos de seguridad de las aplicaciones',
    description: 'Los requisitos de seguridad de la información deben ser identificados, especificados y aprobados cuando se desarrollen o adquieran aplicaciones.',
    status: null,
    observations: ''
  },
  {
    id: '8.27',
    category: 'Tecnológicos',
    title: 'Arquitectura segura de sistemas',
    description: 'Se deben establecer, documentar, mantener y aplicar principios de ingeniería de sistemas seguros a cualquier actividad de desarrollo de sistemas de información.',
    status: null,
    observations: ''
  },
  {
    id: '8.28',
    category: 'Tecnológicos',
    title: 'Codificación segura',
    description: 'Se deben aplicar principios de codificación segura al desarrollo del software, incluyendo la validación de entradas, el manejo de errores y la revisión de código.',
    status: null,
    observations: ''
  },
  {
    id: '8.29',
    category: 'Tecnológicos',
    title: 'Pruebas de seguridad en desarrollo y aceptación',
    description: 'Los procesos de pruebas de seguridad deben ser definidos e implementados en el ciclo de vida del desarrollo.',
    status: null,
    observations: ''
  },
  {
    id: '8.30',
    category: 'Tecnológicos',
    title: 'Externalización del desarrollo',
    description: 'La organización debe dirigir, monitorizar y revisar las actividades relacionadas con el desarrollo de sistemas externalizado.',
    status: null,
    observations: ''
  },
  {
    id: '8.31',
    category: 'Tecnológicos',
    title: 'Separación de entornos de desarrollo, prueba y producción',
    description: 'Los entornos de desarrollo, prueba y producción deben estar separados y asegurados para reducir los riesgos de acceso o cambios no autorizados al entorno de producción.',
    status: null,
    observations: ''
  },
  {
    id: '8.32',
    category: 'Tecnológicos',
    title: 'Gestión de cambios',
    description: 'Los cambios en las instalaciones de procesamiento de información y los sistemas de información deben estar sujetos a procedimientos de gestión de cambios.',
    status: null,
    observations: ''
  },
  {
    id: '8.33',
    category: 'Tecnológicos',
    title: 'Datos de prueba',
    description: 'Los datos de prueba deben ser seleccionados, protegidos y gestionados adecuadamente.',
    status: null,
    observations: ''
  },
  {
    id: '8.34',
    category: 'Tecnológicos',
    title: 'Protección de sistemas durante pruebas de auditoría',
    description: 'Las pruebas de auditoría y otras actividades de aseguramiento que involucren la evaluación de los sistemas operativos deben ser planificadas y acordadas entre el probador y la gestión apropiada.',
    status: null,
    observations: ''
  }
];

export const mockFindings = [
  {
    id: 'HALL-001',
    auditId: 'AUD-2026-001',
    condition: 'El 40% de los equipos de computación del departamento de finanzas no cuentan con software antivirus.',
    criterion: 'Control 8.1 ISO 27001:2022 y Norma 10 del Manual de Auditoría CGR.',
    cause: 'Falta de renovación de licencias anuales por déficit presupuestario.',
    effect: 'Riesgo alto de infección por malware que puede comprometer la integridad y disponibilidad de la data financiera del municipio.',
    severity: 'Crítico',
    status: 'Abierto'
  }
];

export const mockReports = [
  {
    id: 'REP-001',
    auditId: 'AUD-2026-001',
    auditTitle: 'Evaluación de Seguridad BD',
    entity: 'Alcaldía de Pedraza',
    preliminary: { status: 'generado', date: '2026-05-15' },
    definitive: { status: 'firmado', date: '2026-05-20', signedBy: 'Carlos Mendoza', signType: 'digital' },
    executive: { status: 'generado', date: '2026-05-20' },
    createdAt: '2026-05-15'
  },
  {
    id: 'REP-002',
    auditId: 'AUD-2026-002',
    auditTitle: 'Auditoría Redes Internas',
    entity: 'Concejo Municipal',
    preliminary: { status: 'generado', date: '2026-04-10' },
    definitive: { status: 'pendiente', date: null },
    executive: { status: 'pendiente', date: null },
    createdAt: '2026-04-10'
  }
];

export const mockPACs = [
  {
    id: 'PAC-001',
    auditId: 'AUD-2026-001',
    status: 'Borrador', // Borrador, Conformado
    actions: [
      {
        recommendationId: 'HALL-001',
        correctiveAction: 'Adquirir e instalar licencias de antivirus para todos los equipos de la unidad financiera.',
        verificationMethod: 'Factura de compra e informe de instalación técnica',
        responsible: 'Ing. María López (Soporte Técnico)',
        estimatedDate: '2026-06-30',
        observations: 'Presupuesto aprobado en punto de cuenta N° 45.'
      }
    ],
    signatures: {
      elaborated: { status: 'firmado', name: 'Lic. José Ramírez', role: 'Director de Finanzas' },
      approved: { status: 'firmado', name: 'Econ. Pedro Gómez', role: 'Alcalde (E)' },
      conformed: { status: 'pendiente', name: null, role: 'Coordinador de Auditoría' }
    },
    createdAt: '2026-05-21'
  }
];

export const mockSystemConfig = {
  institutional: {
    institutionName: 'Contraloría del Municipio Pedraza',
    address: 'Contraloría del Municipio Pedraza - Estado Barinas Av. 7, entre calles 13 y 14, Edif. Sede de la Biblioteca Pública, Oficina Principal Sector Cultura I, Parroquia Ciudad Bolivia.',
    phone: '+58 273-9210251',
    email: 'contraloria_pedraza@hotmail.com',
    rif: 'G-20002278-7',
    fiscalYear: 2026,
    maxAuthority: 'Jose Alexander Jimenez Devia',
    maxAuthorityRole: 'Contralor Interino del Municipio Pedraza',
    maxAuthorityAppointment: 'Acta de Sesión Extraordinaria Nro. 003-2019 de fecha 15-05-2019',
    maxAuthorityGazette: 'Gaceta Municipal Nro 1025 de fecha 15-05-2019'
  },
  audit: {
    defaultPACDeadlineDays: 30,
    reportSignatureDeadlineDays: 15,
    alertAdvanceDays: 5,
    requireDigitalSignature: true,
    isoScales: [
      { key: 'Cumple', label: 'Cumple', color: '#10B981' },
      { key: 'No cumple', label: 'No cumple', color: '#EF4444' },
      { key: 'N/A', label: 'N/A', color: '#6B7280' }
    ],
    checklistCategories: ['Organizacionales', 'Personas', 'Físicos', 'Tecnológicos']
  },
  appearance: {
    theme: 'light',
    timezone: 'America/Caracas',
    dateFormat: 'DD/MM/YYYY',
    language: 'es'
  }
};

export const mockAuditLogs = [
  { id: 'LOG-001', timestamp: '2026-05-17T08:30:00', userId: '1', userName: 'Carlos Mendoza', action: 'LOGIN', module: 'Autenticación', detail: 'Inicio de sesión exitoso', ip: '192.168.1.10' },
  { id: 'LOG-002', timestamp: '2026-05-17T09:15:00', userId: '5', userName: 'José Pérez', action: 'CREATE', module: 'Hallazgos', detail: 'Creación de hallazgo HALL-001 vinculado a AUD-2026-001', ip: '192.168.1.25' },
  { id: 'LOG-003', timestamp: '2026-05-17T09:45:00', userId: '4', userName: 'María Gonzalez', action: 'UPDATE', module: 'Checklist ISO', detail: 'Actualización del control 5.1 — Estado cambiado a Cumple', ip: '192.168.1.30' },
  { id: 'LOG-004', timestamp: '2026-05-17T10:00:00', userId: '2', userName: 'Ana Silva', action: 'SIGN', module: 'Informes', detail: 'Firma digital del Informe Definitivo REP-001', ip: '192.168.1.15' },
  { id: 'LOG-005', timestamp: '2026-05-17T10:30:00', userId: '3', userName: 'Luis Ramos', action: 'CREATE', module: 'Planificación', detail: 'Nueva auditoría AUD-2026-003 registrada', ip: '192.168.1.20' },
  { id: 'LOG-006', timestamp: '2026-05-16T14:20:00', userId: '5', userName: 'José Pérez', action: 'UPLOAD', module: 'Evidencias', detail: 'Carga de archivo scan_antivirus.pdf — SHA256: a3f2...c891', ip: '192.168.1.25' },
  { id: 'LOG-007', timestamp: '2026-05-16T15:00:00', userId: '1', userName: 'Carlos Mendoza', action: 'EXPORT', module: 'Informes', detail: 'Exportación PDF del Informe Ejecutivo REP-001', ip: '192.168.1.10' },
  { id: 'LOG-008', timestamp: '2026-05-16T16:10:00', userId: '2', userName: 'Ana Silva', action: 'UPDATE', module: 'Usuarios', detail: 'Cambio de rol de María Gonzalez a Coordinador de Auditoría', ip: '192.168.1.15' },
  { id: 'LOG-009', timestamp: '2026-05-15T09:00:00', userId: '6', userName: 'Laura Gómez', action: 'REVIEW', module: 'Hallazgos', detail: 'Revisión legal del hallazgo HALL-001 — Validado con eficacia probatoria', ip: '192.168.1.35' },
  { id: 'LOG-010', timestamp: '2026-05-15T11:30:00', userId: '7', userName: 'Pedro Díaz', action: 'CREATE', module: 'Responsabilidades', detail: 'Inicio de procedimiento administrativo vinculado a HALL-001', ip: '192.168.1.40' },
  { id: 'LOG-011', timestamp: '2026-05-14T08:00:00', userId: '5', userName: 'José Pérez', action: 'LOGIN', module: 'Autenticación', detail: 'Inicio de sesión exitoso', ip: '10.0.0.55' },
  { id: 'LOG-012', timestamp: '2026-05-14T10:45:00', userId: '4', userName: 'María Gonzalez', action: 'UPDATE', module: 'PAC', detail: 'Actualización de acción correctiva en PAC-001', ip: '192.168.1.30' },
  { id: 'LOG-013', timestamp: '2026-05-13T13:00:00', userId: '2', userName: 'Ana Silva', action: 'CONFIG', module: 'Configuración', detail: 'Cambio de plazo PAC de 30 a 45 días', ip: '192.168.1.15' },
  { id: 'LOG-014', timestamp: '2026-05-13T14:30:00', userId: '1', userName: 'Carlos Mendoza', action: 'SIGN', module: 'PAC', detail: 'Conformación del PAC-001 con firma digital', ip: '192.168.1.10' },
  { id: 'LOG-015', timestamp: '2026-05-12T09:15:00', userId: '3', userName: 'Luis Ramos', action: 'LOGIN', module: 'Autenticación', detail: 'Inicio de sesión exitoso (2FA verificado)', ip: '192.168.1.20' }
];
