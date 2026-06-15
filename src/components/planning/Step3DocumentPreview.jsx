import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { QrCode, Lock, ArrowLeft } from 'lucide-react';
import { InstitutionalDocumentLayout } from '../document/InstitutionalDocumentLayout';

export const Step3DocumentPreview = ({ generalData, teamData, updateGeneralData, onSignAndGenerate, onCancel, isPreviewOnly = false }) => {
  const [isSigned, setIsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [oficioNumber, setOficioNumber] = useState('');

  useEffect(() => {
    // Generar número de oficio aleatorio simulando correlativo (ej. 142-2026)
    const randomNum = String(Math.floor(Math.random() * 900) + 100);
    const year = new Date().getFullYear();
    setOficioNumber(`${randomNum}-${year}`);
  }, []);

  // Fecha actual formateada
  const dateStr = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
      onSignAndGenerate(); // Notifica al componente padre
    }, 1500);
  };

  const highlightStyle = {
    backgroundColor: isSigned ? 'transparent' : 'rgba(255, 235, 59, 0.3)', // Amarillo suave si no está firmado
    color: 'var(--brand-primary)',
    fontWeight: '500',
    transition: 'all 0.3s'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
      
      {/* Controles de Acción (Ocultos en Split-View) */}
      {!isPreviewOnly && (
        <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="outline" onClick={onCancel} disabled={isSigning} style={{ gap: '0.5rem' }}>
            <ArrowLeft size={18} />
            Regresar a Edición
          </Button>
          {isSigned ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-closed)', fontWeight: 'bold' }}>
              <Lock size={20} />
              Documento Emitido y Bloqueado
            </div>
          ) : (
            <Button variant="primary" onClick={handleSign} disabled={isSigning} style={{ gap: '0.5rem' }}>
              {isSigning ? 'Generando Firma Digital...' : 'Generar y Firmar PDF'}
            </Button>
          )}
        </div>
      )}

      {/* Lienzo tipo Papel con el Layout Institucional */}
      <InstitutionalDocumentLayout isScreen={true}>
        {/* Marca de Agua / Sello si está firmado */}
        {isSigned && (
          <div style={{ position: 'absolute', top: '2rem', right: '3rem', opacity: 0.8, textAlign: 'center', zIndex: 10 }}>
            <QrCode size={80} color="var(--brand-primary)" />
            <div style={{ fontSize: '0.6rem', marginTop: '0.25rem', fontFamily: 'monospace' }}>DOC-VALID-SAI</div>
          </div>
        )}

        {/* Destinatario */}
        <div style={{ marginBottom: '2rem' }}>
          OFICIO N° <span style={highlightStyle}>{generalData.oficioNro || '[Pendiente]'}</span><br />
          Ciudadano (a)<br />
          <span style={highlightStyle}>{generalData.destinatarioNombre || '[NOMBRE DE LA PERSONA]'}</span><br />
          <span style={highlightStyle}>{generalData.destinatarioCargo || 'Cargo que desempeña'}</span><br />
          <span style={highlightStyle}>{generalData.destinatarioDireccion || 'Dirección, ciudad y estado.'}</span><br />
          Presente. -
        </div>

        {/* Fecha */}
        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
          Fecha: {dateStr}
        </div>

        {/* Cuerpo Parte 1 */}
        <p style={{ textAlign: 'justify', marginBottom: '2rem' }}>
          Tengo el agrado de dirigirme a usted, en la oportunidad de participarle que este Órgano 
          Contralor, de conformidad con lo establecido en los artículos 46 y 47 de la Ley Orgánica de 
          la Contraloría General de la República y del Sistema Nacional de Control Fiscal, ha designado 
          una comisión integrada por los funcionarios:
        </p>

        {/* Tabla de Comisión */}
        <table style={{ width: '80%', margin: '0 auto 2rem auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingBottom: '1rem' }}>Cédula</th>
              <th style={{ textAlign: 'left', paddingBottom: '1rem' }}>Nombre</th>
              <th style={{ textAlign: 'left', paddingBottom: '1rem' }}>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {teamData.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>[Sin Comisión Asignada]</td></tr>
            ) : (
              teamData.map((member, idx) => (
                <tr key={idx}>
                  <td style={{ ...highlightStyle, paddingBottom: '0.5rem' }}>{member.cedula}</td>
                  <td style={{ ...highlightStyle, paddingBottom: '0.5rem' }}>{member.nombre}</td>
                  <td style={{ ...highlightStyle, paddingBottom: '0.5rem' }}>{member.cargo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Cuerpo Parte 2 y Objeto (Inline Edit) */}
        <div style={{ textAlign: 'justify', marginBottom: '2rem' }}>
          A los fines de practicar una auditoría relacionada con:<br /><br />
          {isSigned ? (
            <div style={{ textAlign: 'justify' }}>{generalData.objetivo || generalData.objetoAuditoria}</div>
          ) : (
            <textarea 
              value={generalData.objetivo || generalData.objetoAuditoria}
              onChange={(e) => updateGeneralData({ ...generalData, objetivo: e.target.value, objetoAuditoria: e.target.value })}
              style={{
                width: '100%',
                minHeight: '80px',
                border: '1px dashed rgba(255, 235, 59, 0.8)',
                backgroundColor: 'rgba(255, 235, 59, 0.1)',
                color: '#000',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: '11pt',
                resize: 'vertical',
                padding: '0.5rem',
                lineHeight: '1.6'
              }}
              title="Puedes editar el objeto aquí mismo"
            />
          )}
        </div>

        {/* Despedida */}
        <p style={{ textAlign: 'justify', marginBottom: '3rem' }}>
          En tal sentido, se le estima prestar la mayor colaboración a los funcionarios mencionados, 
          para el cabal cumplimiento de la labor fiscal que le ha sido encomendada.
        </p>

        {/* Firma */}
        <div>
          Atentamente,<br /><br /><br /><br />
          NOMBRES Y APELLIDOS<br />
          Contralor Municipal
        </div>
      </InstitutionalDocumentLayout>
    </div>
  );
};
