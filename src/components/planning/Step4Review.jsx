import React, { useState, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Activity, Download } from 'lucide-react';
import { Step3DocumentPreview } from './Step3DocumentPreview';

export const Step4Review = ({ generalData, teamData, riesgos, updateGeneralData, onSignAndGenerate }) => {
  const [activeTab, setActiveTab] = useState('oficio');
  const [observaciones, setObservaciones] = useState('');
  const oficioRef = useRef(null);
  const matrizRef = useRef(null);

  // Buscar coordinador en el equipo para las firmas
  const coordinador = teamData.find(m => m.cargo === 'Coordinador de Auditoría');
  const coordinadorNombre = coordinador ? coordinador.nombre : '[No asignado]';

  // Cálculos por categoría
  const calcularPorCategoria = (categoria) => {
    return riesgos
      .filter(r => r.categoria === categoria)
      .reduce((acc, r) => acc + (r.prob * r.impacto), 0);
  };

  const totalInherente = calcularPorCategoria('Riesgo Inherente');
  const totalControl = calcularPorCategoria('Riesgo de Control');
  const totalDeteccion = calcularPorCategoria('Riesgo de Detección');
  const totalGeneral = totalInherente + totalControl + totalDeteccion;

  let nivelRiesgo = '';
  if (totalGeneral <= 42) nivelRiesgo = 'Aceptable';
  else if (totalGeneral <= 84) nivelRiesgo = 'Tolerable';
  else nivelRiesgo = 'Inaceptable';

  // Función para generar PDF usando window.print
  const handleGenerarPDF = (ref, tituloDocumento) => {
    const contenido = ref.current;
    if (!contenido) return;

    const ventana = window.open('', '_blank');
    ventana.document.write(`
      <html>
        <head>
          <title>${tituloDocumento}</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 0.5rem; }
          </style>
        </head>
        <body>${contenido.innerHTML}</body>
      </html>
    `);

    // Copiar estilos de la ventana principal para que se aplique la papelería
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
    stylesheets.forEach(stylesheet => {
      ventana.document.head.appendChild(stylesheet.cloneNode(true));
    });

    ventana.document.close();

    // Retardo para dar tiempo a que los estilos se apliquen
    setTimeout(() => {
      ventana.focus();
      ventana.print();
    }, 250);
  };

  const tabStyle = (tabName) => ({
    padding: '1rem 2rem',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === tabName ? '3px solid var(--brand-accent)' : '3px solid transparent',
    color: activeTab === tabName ? 'var(--brand-primary)' : 'var(--text-secondary)',
    fontWeight: activeTab === tabName ? 'bold' : 'normal',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem'
  });

  const cellStyle = { border: '1px solid #000', padding: '0.5rem' };
  const cellCenterStyle = { ...cellStyle, textAlign: 'center' };
  const totalRowStyle = { backgroundColor: '#e8e8e8', fontWeight: 'bold' };

  const renderRiesgosPorCategoria = (categoria) => {
    const items = riesgos.filter(r => r.categoria === categoria);
    const subtotal = items.reduce((acc, r) => acc + (r.prob * r.impacto), 0);

    return (
      <>
        {items.map((r, idx) => (
          <tr key={r.id || idx}>
            <td style={cellStyle}>{r.factor}</td>
            <td style={cellCenterStyle}>{r.prob}</td>
            <td style={cellCenterStyle}>{r.impacto}</td>
            <td style={cellCenterStyle}>{r.prob * r.impacto}</td>
          </tr>
        ))}
        <tr style={totalRowStyle}>
          <td style={{ ...cellStyle, fontWeight: 'bold' }} colSpan="3">
            Total {categoria}
          </td>
          <td style={{ ...cellCenterStyle, fontWeight: 'bold' }}>{subtotal}</td>
        </tr>
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <h2 style={{ margin: '0 0 0.5rem 0' }}>Revisión y Emisión de Documentos</h2>

      {/* Pestañas */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-light)' }}>
        <button onClick={() => setActiveTab('oficio')} style={tabStyle('oficio')}>
          <FileText size={18} />
          Oficio de Presentación
        </button>
        <button onClick={() => setActiveTab('matriz')} style={tabStyle('matriz')}>
          <Activity size={18} />
          Matriz de Evaluación de Riesgos
        </button>
      </div>

      {/* Contenido */}
      <div style={{ backgroundColor: '#eef2f6', padding: '2rem', borderRadius: 'var(--radius-card)' }}>
        
        {activeTab === 'oficio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <Button 
                variant="primary" 
                onClick={() => handleGenerarPDF(oficioRef, 'Oficio de Presentación')}
                style={{ gap: '0.5rem' }}
              >
                <Download size={18} />
                Aprobar y Generar Documento
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }} ref={oficioRef}>
              <Step3DocumentPreview 
                generalData={generalData}
                teamData={teamData}
                updateGeneralData={updateGeneralData}
                isPreviewOnly={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'matriz' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <Button 
                variant="primary" 
                onClick={() => handleGenerarPDF(matrizRef, 'Matriz de Evaluación de Riesgos')}
                style={{ gap: '0.5rem' }}
              >
                <Download size={18} />
                Aprobar y Generar Documento
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }} ref={matrizRef}>
              <div style={{
                width: '100%',
                maxWidth: '850px',
                backgroundColor: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '4rem',
                color: '#000',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: '1.6',
                fontSize: '11pt'
              }}>
                {/* Encabezado */}
                <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '2rem' }}>
                  REPÚBLICA BOLIVARIANA DE VENEZUELA<br />
                  CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS<br />
                  DIRECCIÓN DE CONTROL DE LA ADMINISTRACIÓN CENTRAL Y DESCENTRALIZADA<br /><br />
                  MATRIZ DE EVALUACIÓN DE RIESGOS DE AUDITORÍA
                </div>
                
                {/* Datos de la Auditoría */}
                <div style={{ marginBottom: '2rem' }}>
                  <strong>Institución Auditada:</strong> {generalData.institucion || '[No especificada]'}<br />
                  <strong>Tipo de Auditoría:</strong> {generalData.tipo || 'Seguridad de la Información'}<br />
                  <strong>Alcance:</strong> {generalData.alcanceDesde || '[No definido]'} al {generalData.alcanceHasta || '[No definido]'}<br />
                  <strong>Objetivo:</strong> {generalData.objetivo || '[No definido]'}
                </div>

                {/* Tabla de Riesgos con subtotales */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <th style={{ ...cellStyle, textAlign: 'left' }}>Factor de Riesgo</th>
                      <th style={cellCenterStyle}>Probabilidad</th>
                      <th style={cellCenterStyle}>Impacto</th>
                      <th style={cellCenterStyle}>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Riesgos Inherentes + Subtotal */}
                    <tr>
                      <td colSpan="4" style={{ ...cellStyle, backgroundColor: '#d0e0f0', fontWeight: 'bold', textAlign: 'center' }}>
                        Riesgos Inherentes
                      </td>
                    </tr>
                    {renderRiesgosPorCategoria('Riesgo Inherente')}

                    {/* Riesgos de Control + Subtotal */}
                    <tr>
                      <td colSpan="4" style={{ ...cellStyle, backgroundColor: '#d0e0f0', fontWeight: 'bold', textAlign: 'center' }}>
                        Riesgos de Control
                      </td>
                    </tr>
                    {renderRiesgosPorCategoria('Riesgo de Control')}

                    {/* Riesgos de Detección + Subtotal */}
                    <tr>
                      <td colSpan="4" style={{ ...cellStyle, backgroundColor: '#d0e0f0', fontWeight: 'bold', textAlign: 'center' }}>
                        Riesgos de Detección
                      </td>
                    </tr>
                    {renderRiesgosPorCategoria('Riesgo de Detección')}

                    {/* Total General */}
                    <tr style={{ backgroundColor: '#c0c0c0' }}>
                      <td style={{ ...cellStyle, fontWeight: 'bold' }} colSpan="3">
                        Total General (Resultado de Matriz de Evaluación de Riesgo de Auditoría)
                      </td>
                      <td style={{ ...cellCenterStyle, fontWeight: 'bold', fontSize: '1.1em' }}>
                        {totalGeneral}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...cellStyle, fontWeight: 'bold' }} colSpan="3">
                        Calificación de Riesgo
                      </td>
                      <td style={{ ...cellCenterStyle, fontWeight: 'bold' }}>
                        {nivelRiesgo}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Observaciones */}
                <div style={{ marginBottom: '3rem' }}>
                  <strong>Observaciones:</strong>
                  <div style={{ 
                    border: '1px solid #000', 
                    minHeight: '80px', 
                    padding: '0.75rem', 
                    marginTop: '0.5rem' 
                  }}>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Señale cualquier información adicional que considere relevante sobre los riesgos de auditoría..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        border: 'none',
                        outline: 'none',
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: '11pt',
                        resize: 'vertical',
                        lineHeight: '1.6'
                      }}
                    />
                  </div>
                </div>

                {/* Firmas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', marginTop: '4rem' }}>
                  <div>
                    ________________________________<br />
                    <strong>Elaborado por:</strong><br />
                    {coordinadorNombre}<br />
                    Coordinador de Auditoría
                  </div>
                  <div>
                    ________________________________<br />
                    <strong>Aprobado por:</strong><br />
                    Director de Control
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* Acción Final */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="primary" onClick={onSignAndGenerate} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Finalizar Planificación
        </Button>
      </div>

    </div>
  );
};
