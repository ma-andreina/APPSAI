// Datos de demostración para el Sistema de Auditoría Informática (SAI)

export const mockUsers = [
  { id: '1', name: 'Carlos Mendoza', role: 'Contralor Municipal', email: 'cmendoza@cmp.gob.ve', avatar: 'CM', status: 'Activo', twoFactorEnabled: true, createdAt: '2025-01-15' },
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
  {
    id: '5.1',
    category: 'Organizacionales',
    title: 'Políticas para la seguridad de la información',
    description: 'La política de seguridad de la información y las políticas específicas del tema deben ser definidas, aprobadas por la dirección, publicadas, comunicadas y reconocidas por los empleados relevantes.',
    status: null, // null significa "sin auditar" (círculo rojo)
    observations: ''
  },
  {
    id: '5.2',
    category: 'Organizacionales',
    title: 'Roles y responsabilidades de seguridad de la información',
    description: 'Todas las responsabilidades de seguridad de la información deben ser definidas y asignadas de acuerdo con las necesidades de la organización.',
    status: 'Cumple',
    observations: 'Definidos en el manual de organización.'
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
    id: '6.1',
    category: 'Personas',
    title: 'Investigación de antecedentes',
    description: 'Se deben realizar verificaciones de antecedentes para todos los candidatos a empleo de acuerdo con las leyes relevantes, regulaciones y la ética.',
    status: 'Parcial',
    observations: 'Solo se hace para personal fijo, no para contratistas temporales.'
  },
  {
    id: '6.2',
    category: 'Personas',
    title: 'Términos y condiciones de empleo',
    description: 'Los acuerdos contractuales con empleados y contratistas deben establecer sus responsabilidades y las de la organización respecto a la seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '7.1',
    category: 'Físicos',
    title: 'Perímetros de seguridad física',
    description: 'Los perímetros de seguridad deben definirse y utilizarse para proteger áreas que contienen información y otros activos asociados.',
    status: 'No Cumple',
    observations: 'Falta control de acceso biométrico en el servidor central.'
  },
  {
    id: '7.2',
    category: 'Físicos',
    title: 'Controles de entrada física',
    description: 'Las áreas seguras deben estar protegidas por controles de entrada adecuados para asegurar que solo el personal autorizado tenga acceso.',
    status: null,
    observations: ''
  },
  {
    id: '8.1',
    category: 'Tecnológicos',
    title: 'Dispositivos de punto final de usuario',
    description: 'La información almacenada, procesada o accesible a través de dispositivos de punto final de usuario debe estar protegida.',
    status: null,
    observations: ''
  },
  {
    id: '8.8',
    category: 'Tecnológicos',
    title: 'Gestión de vulnerabilidades técnicas',
    description: 'Debe obtenerse información sobre las vulnerabilidades técnicas de los sistemas de información que se están utilizando, evaluar la exposición y tomar medidas apropiadas.',
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
    address: 'Av. Bolívar, Edificio Contraloría, Ciudad Bolivia, Estado Barinas',
    phone: '+58 273-8811234',
    email: 'contraloria@cmp.gob.ve',
    rif: 'G-20001234-5',
    fiscalYear: 2026,
    maxAuthority: 'Carlos Mendoza',
    maxAuthorityRole: 'Contralor Municipal'
  },
  audit: {
    defaultPACDeadlineDays: 30,
    reportSignatureDeadlineDays: 15,
    alertAdvanceDays: 5,
    requireDigitalSignature: true,
    isoScales: [
      { key: 'Cumple', label: 'Cumple', color: '#10B981' },
      { key: 'Parcial', label: 'Cumple Parcialmente', color: '#F5A623' },
      { key: 'No Cumple', label: 'No Cumple', color: '#EF4444' }
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
