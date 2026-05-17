import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Download, CheckCircle, QrCode } from 'lucide-react';

export const PACViewerModal = ({ isOpen, onClose, pac, baseData, recommendations }) => {
  if (!isOpen || !pac || !baseData) return null;

  const isConformed = pac.status === 'Conformado';

  // Simulación de hoja Landscape con márgenes (aprox Carta Horizontal)
  const landscapePageStyle = {
    backgroundColor: 'white',
    padding: '3cm', // Margen institucional
    boxShadow: 'var(--shadow-lg)',
    margin: '0 auto',
    width: '1056px', // 11 pulgadas
    minHeight: '816px', // 8.5 pulgadas
    color: 'black',
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '11pt',
    lineHeight: '1.2',
    position: 'relative'
  };

  const tableHeaderStyle = {
    backgroundColor: '#F3F4F6',
    border: '1px solid black',
    padding: '0.5rem',
    fontWeight: 'bold',
    textAlign: 'center'
  };

  const tableCellStyle = {
    border: '1px solid black',
    padding: '0.5rem',
    verticalAlign: 'top',
    wordBreak: 'break-word'
  };

  // Paginación simulada: 1 página asumiendo que cabe, pero en un sistema real se dividiría
  const dateToUse = pac.presentationDate || pac.createdAt || new Date().toISOString();
  const currentDate = new Date(dateToUse).toLocaleDateString('es-VE');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vista Previa: Plan de Acciones Correctivas" size="xl">
      
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <Button variant="outline" size="sm" onClick={() => alert('Simulando descarga Word (Landscape)')}>
          <Download size={16} style={{ marginRight: '8px' }} /> Descargar Plan (Word)
        </Button>
        <Button variant={isConformed ? "primary" : "secondary"} size="sm" onClick={() => alert('Simulando descarga PDF')}>
          <Download size={16} style={{ marginRight: '8px' }} /> {isConformed ? 'Descargar Conformidad (PDF)' : 'Emitir para Conformidad (PDF)'}
        </Button>
      </div>

      <div style={{ backgroundColor: '#E2E8F0', padding: '2rem 1rem', borderRadius: '4px', overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <div style={landscapePageStyle}>
          
          {/* Header Landscape */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'left', fontWeight: 'bold' }}>
              <div>REPÚBLICA BOLIVARIANA DE VENEZUELA</div>
              <div>CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS</div>
              <div style={{ marginTop: '0.5rem' }}>ENTE AUDITADO: {baseData.organism}</div>
              <div>INFORME DEFINITIVO N°: {baseData.auditId}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div><strong>Fecha de Registro:</strong> {currentDate}</div>
              <div><strong>Página:</strong> 1 de 1</div>
            </div>
          </div>

          <h1 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', textTransform: 'uppercase' }}>
            PLAN DE ACCIONES CORRECTIVAS
          </h1>

          {/* Tabla de Acciones */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, width: '5%' }}>N°</th>
                <th style={{ ...tableHeaderStyle, width: '25%' }}>Observación / Recomendación</th>
                <th style={{ ...tableHeaderStyle, width: '25%' }}>Acción Correctiva</th>
                <th style={{ ...tableHeaderStyle, width: '15%' }}>Medio de Verificación</th>
                <th style={{ ...tableHeaderStyle, width: '15%' }}>Responsable</th>
                <th style={{ ...tableHeaderStyle, width: '15%' }}>Tiempo Estimado</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, index) => {
                const action = pac.actions.find(a => a.recommendationId === rec.id) || {};
                return (
                  <tr key={rec.id}>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ ...tableCellStyle }}><strong>{rec.title}:</strong> {rec.description}</td>
                    <td style={{ ...tableCellStyle }}>{action.correctiveAction || '-'}</td>
                    <td style={{ ...tableCellStyle }}>{action.verificationMethod || '-'}</td>
                    <td style={{ ...tableCellStyle }}>{action.responsible || '-'}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>{action.estimatedDate ? new Date(action.estimatedDate).toLocaleDateString('es-VE') : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Firmas Landscape */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', padding: '0 2rem' }}>
            
            {/* Elaborado Por */}
            <div style={{ width: '25%', textAlign: 'center' }}>
              {pac.signatures.elaborated.status === 'firmado' ? (
                <>
                  <div style={{ borderBottom: '1px solid black', height: '60px', marginBottom: '0.5rem' }}></div>
                  <div style={{ fontWeight: 'bold' }}>{pac.signatures.elaborated.name}</div>
                  <div>{pac.signatures.elaborated.role}</div>
                </>
              ) : (
                <div style={{ opacity: 0.5 }}>
                  <div style={{ borderBottom: '1px dashed black', height: '60px', marginBottom: '0.5rem' }}></div>
                  <div style={{ fontStyle: 'italic' }}>Elaborado Por (Ente)</div>
                </div>
              )}
            </div>

            {/* Aprobado Por */}
            <div style={{ width: '25%', textAlign: 'center' }}>
              {pac.signatures.approved.status === 'firmado' ? (
                <>
                  <div style={{ borderBottom: '1px solid black', height: '60px', marginBottom: '0.5rem' }}></div>
                  <div style={{ fontWeight: 'bold' }}>{pac.signatures.approved.name}</div>
                  <div>{pac.signatures.approved.role}</div>
                </>
              ) : (
                <div style={{ opacity: 0.5 }}>
                  <div style={{ borderBottom: '1px dashed black', height: '60px', marginBottom: '0.5rem' }}></div>
                  <div style={{ fontStyle: 'italic' }}>Aprobado Por (Ente)</div>
                </div>
              )}
            </div>

            {/* Conformado Por */}
            <div style={{ width: '35%', textAlign: 'center' }}>
              {pac.signatures.conformed.status === 'firmado' ? (
                <div style={{ border: '2px solid var(--brand-accent)', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#F0F9FF', color: 'var(--brand-primary)', textAlign: 'left' }}>
                  <QrCode size={48} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>CONFORMIDAD DIGITAL:</div>
                    <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>{pac.signatures.conformed.name}</div>
                    <div style={{ fontSize: '9pt' }}>{pac.signatures.conformed.role}</div>
                  </div>
                </div>
              ) : (
                <div style={{ opacity: 0.5 }}>
                  <div style={{ borderBottom: '1px dashed black', height: '60px', marginBottom: '0.5rem' }}></div>
                  <div style={{ fontStyle: 'italic' }}>Conformado Por (Contraloría)</div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </Modal>
  );
};
