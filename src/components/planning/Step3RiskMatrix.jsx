import React, { useEffect } from 'react';
import { Card } from '../ui/Card';

const DESCRIPCIONES_CATEGORIAS = {
  'Riesgo Inherente': 'Son aquellos propios de la naturaleza del ente y su manejo de información, ignorando cualquier control existente.',
  'Riesgo de Control': 'Se refieren a la posibilidad de que el Sistema de Gestión de Seguridad de la Información (SGSI) del ente no prevenga o detecte un fallo.',
  'Riesgo de Detección': 'Representan la posibilidad de que el equipo auditor no detecte una desviación significativa durante su trabajo.'
};

const DESCRIPCIONES_FACTORES = {
  'Volumen y Criticidad de Datos': 'Cantidad de activos de información sensibles (datos personales, financieros, secretos industriales) que maneja el ente.',
  'Complejidad de los Procesos': 'Procesos técnicos altamente complejos o interconectados que aumentan la posibilidad de error humano o técnico.',
  'Naturaleza Jurídica y Regulatoria': 'Grado de exposición a leyes estrictas de protección de datos o cumplimiento gubernamental.',
  'Entorno Tecnológico': 'Uso de tecnologías emergentes, sistemas legados (antiguos) o infraestructuras críticas que son blancos frecuentes de ataques.',
  'Ubicación Geográfica y Física': 'Riesgos del entorno donde residen los servidores (ej. zonas propensas a desastres naturales o inestabilidad social).',
  'Madurez del SGSI': 'Inexistencia o desactualización de las políticas de seguridad según la norma ISO 27001.',
  'Segregación de Funciones': 'Debilidades en la asignación de permisos, permitiendo que un solo usuario tenga excesivo control sobre procesos críticos.',
  'Cultura Organizacional': 'Falta de programas de concienciación y capacitación en seguridad para el personal.',
  'Eficacia de Controles Técnicos': 'Fallas en herramientas de monitoreo, firewalls o sistemas de detección de intrusos.',
  'Gestión de Incidentes Previos': 'Historial de brechas de seguridad no resueltas o tratadas de manera ineficiente.',
  'Competencia del Equipo Auditor': 'Falta de experiencia técnica específica en ISO 27001 o en las tecnologías particulares de la institución.',
  'Limitaciones de Tiempo y Recursos': 'Cronograma demasiado ajustado que impida realizar pruebas sustantivas profundas.',
  'Calidad de la Evidencia': 'Dificultad para acceder a logs, registros o entrevistas clave que respalden los hallazgos.',
  'Muestreo de Auditoría': 'Riesgo de que la muestra seleccionada (de los 93 controles) no sea representativa de la realidad de la organización.',
  'Independencia y Objetividad': 'Posibles conflictos de interés que nublen el juicio del auditor al evaluar los controles.'
};

const FACTORES_INICIALES = [
  // Riesgos Inherentes
  { id: 'i1', categoria: 'Riesgo Inherente', factor: 'Volumen y Criticidad de Datos', prob: 1, impacto: 1 },
  { id: 'i2', categoria: 'Riesgo Inherente', factor: 'Complejidad de los Procesos', prob: 1, impacto: 1 },
  { id: 'i3', categoria: 'Riesgo Inherente', factor: 'Naturaleza Jurídica y Regulatoria', prob: 1, impacto: 1 },
  { id: 'i4', categoria: 'Riesgo Inherente', factor: 'Entorno Tecnológico', prob: 1, impacto: 1 },
  { id: 'i5', categoria: 'Riesgo Inherente', factor: 'Ubicación Geográfica y Física', prob: 1, impacto: 1 },
  // Riesgos de Control
  { id: 'c1', categoria: 'Riesgo de Control', factor: 'Madurez del SGSI', prob: 1, impacto: 1 },
  { id: 'c2', categoria: 'Riesgo de Control', factor: 'Segregación de Funciones', prob: 1, impacto: 1 },
  { id: 'c3', categoria: 'Riesgo de Control', factor: 'Cultura Organizacional', prob: 1, impacto: 1 },
  { id: 'c4', categoria: 'Riesgo de Control', factor: 'Eficacia de Controles Técnicos', prob: 1, impacto: 1 },
  { id: 'c5', categoria: 'Riesgo de Control', factor: 'Gestión de Incidentes Previos', prob: 1, impacto: 1 },
  // Riesgos de Detección
  { id: 'd1', categoria: 'Riesgo de Detección', factor: 'Competencia del Equipo Auditor', prob: 1, impacto: 1 },
  { id: 'd2', categoria: 'Riesgo de Detección', factor: 'Limitaciones de Tiempo y Recursos', prob: 1, impacto: 1 },
  { id: 'd3', categoria: 'Riesgo de Detección', factor: 'Calidad de la Evidencia', prob: 1, impacto: 1 },
  { id: 'd4', categoria: 'Riesgo de Detección', factor: 'Muestreo de Auditoría', prob: 1, impacto: 1 },
  { id: 'd5', categoria: 'Riesgo de Detección', factor: 'Independencia y Objetividad', prob: 1, impacto: 1 },
];

export const Step3RiskMatrix = ({ riesgos, updateRiesgos }) => {
  // Inicializar factores si está vacío
  useEffect(() => {
    if (riesgos.length === 0) {
      updateRiesgos(FACTORES_INICIALES);
    }
  }, [riesgos, updateRiesgos]);

  const handleChange = (id, field, value) => {
    const newData = riesgos.map(r => {
      if (r.id === id) {
        return { ...r, [field]: parseInt(value) };
      }
      return r;
    });
    updateRiesgos(newData);
  };

  const calcularTotal = () => {
    return riesgos.reduce((acc, r) => acc + (r.prob * r.impacto), 0);
  };

  const total = calcularTotal();

  let nivelRiesgo = '';
  let colorRiesgo = '';
  let termometroWidth = '0%';

  if (total <= 42) {
    nivelRiesgo = 'Aceptable';
    colorRiesgo = '#10B981'; // Verde
    termometroWidth = `${(total / 42) * 33}%`;
  } else if (total <= 84) {
    nivelRiesgo = 'Tolerable';
    colorRiesgo = '#F5A623'; // Amarillo
    termometroWidth = `${33 + ((total - 42) / 42) * 33}%`;
  } else {
    nivelRiesgo = 'Inaceptable';
    colorRiesgo = '#EF4444'; // Rojo
    const max = 135; // El máximo real matemático es 15 * 9 = 135
    termometroWidth = `${66 + Math.min(((total - 84) / (max - 84)) * 34, 34)}%`;
  }

  const renderTable = (categoria) => {
    const items = riesgos.filter(r => r.categoria === categoria);
    if (items.length === 0) return null;

    const descripcionCategoria = DESCRIPCIONES_CATEGORIAS[categoria] || '';

    return (
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--brand-primary)', borderBottom: '2px solid var(--brand-accent)', paddingBottom: '0.5rem' }}>
          {categoria}
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.5rem 0 1rem 0', lineHeight: '1.5' }}>
          {descripcionCategoria}
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-light)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '40%' }}>Factor de Riesgo</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '25%' }}>Descripción</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Probabilidad (1-3)</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Impacto (1-3)</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const resultado = item.prob * item.impacto;
              let resultColor = 'var(--text-primary)';
              if (resultado >= 6) resultColor = 'var(--status-critical)';
              else if (resultado >= 3) resultColor = 'var(--status-warning)';
              
              const descripcionFactor = DESCRIPCIONES_FACTORES[item.factor] || '';

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{item.factor}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{descripcionFactor}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <select 
                      value={item.prob} 
                      onChange={(e) => handleChange(item.id, 'prob', e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                    >
                      <option value="1">1 - Baja</option>
                      <option value="2">2 - Media</option>
                      <option value="3">3 - Alta</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <select 
                      value={item.impacto} 
                      onChange={(e) => handleChange(item.id, 'impacto', e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                    >
                      <option value="1">1 - Leve</option>
                      <option value="2">2 - Moderado</option>
                      <option value="3">3 - Grave</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', color: resultColor }}>
                    {resultado}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ flex: 1, marginRight: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Matriz de Evaluación de Riesgos</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
            Evalúe la probabilidad y el impacto de cada factor para determinar el riesgo global. 
            La <strong>probabilidad</strong> asigna la posibilidad de ocurrencia de los elementos de cada riesgo. 
            El <strong>impacto</strong> determina la magnitud de las posibles consecuencias que implica la ocurrencia 
            de los elementos de cada tipo de riesgo.
          </p>
        </div>

        {/* Termómetro de Riesgo */}
        <div style={{ 
          backgroundColor: 'var(--surface-light)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-card)',
          width: '300px',
          flexShrink: 0,
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>Nivel de Riesgo Global:</span>
            <span style={{ fontWeight: 'bold', color: colorRiesgo }}>{total} pts</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ 
              width: termometroWidth, 
              height: '100%', 
              backgroundColor: colorRiesgo,
              transition: 'all 0.5s ease-out'
            }} />
          </div>
          <div style={{ textAlign: 'right', fontWeight: 'bold', color: colorRiesgo, fontSize: '1.1rem' }}>
            {nivelRiesgo}
          </div>
        </div>
      </div>

      {riesgos.length > 0 && (
        <>
          {renderTable('Riesgo Inherente')}
          {renderTable('Riesgo de Control')}
          {renderTable('Riesgo de Detección')}
        </>
      )}
    </Card>
  );
};
