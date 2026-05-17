import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';
import { Download, FileSignature, CheckCircle, QrCode } from 'lucide-react';

export const ReportViewerModal = ({ isOpen, onClose, report, type, onOpenSignatureModal }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen && report) {
      setLoading(true);
      reportService.generateReportData(report.auditId, type).then(data => {
        setContent(data);
        setLoading(false);
      });
    }
  }, [isOpen, report, type]);

  if (!isOpen || !report) return null;

  const isDefinitive = type === 'definitivo';
  const isSigned = report.definitive?.status === 'firmado';
  const canSign = isDefinitive && !isSigned && currentUser?.role === 'Contralor Municipal';

  // Estilos que simulan una hoja de papel tamaño carta con márgenes institucionales (3cm)
  const pageStyle = {
    backgroundColor: 'white',
    padding: '3cm', // Margen institucional
    boxShadow: 'var(--shadow-lg)',
    margin: '0 auto',
    maxWidth: '816px', // Aprox tamaño carta en pixels (96dpi)
    minHeight: '1056px',
    color: 'black',
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '12pt',
    lineHeight: '1.5',
    position: 'relative'
  };

  const h1Style = { fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase' };
  const h2Style = { fontSize: '12pt', fontWeight: 'bold', marginTop: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase' };
  const h3Style = { fontSize: '12pt', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem' };
  const pStyle = { marginBottom: '1rem', textAlign: 'justify' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Vista Previa: Informe ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
      
      {/* Toolbar superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge status="default">{report.auditId}</Badge>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Estado: {isDefinitive && isSigned ? 'Firmado' : 'Borrador'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={() => alert('Simulando descarga Docx')}>
            <Download size={16} style={{ marginRight: '8px' }} /> DOCX
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert('Simulando descarga PDF')}>
            <Download size={16} style={{ marginRight: '8px' }} /> PDF
          </Button>
          {canSign && (
            <Button variant="primary" size="sm" onClick={() => onOpenSignatureModal()}>
              <FileSignature size={16} style={{ marginRight: '8px' }} /> Firmar Informe
            </Button>
          )}
        </div>
      </div>

      {/* Contenedor del documento (Fondo gris) */}
      <div style={{ backgroundColor: '#E2E8F0', padding: '2rem 1rem', borderRadius: '4px', overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
        
        {loading ? (
          <div style={pageStyle}>
            <Skeleton height="30px" width="80%" style={{ margin: '0 auto 2rem auto' }} />
            <Skeleton height="15px" width="100%" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height="15px" width="100%" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height="15px" width="90%" style={{ marginBottom: '2rem' }} />
            <Skeleton height="20px" width="40%" style={{ marginBottom: '1rem' }} />
            <Skeleton height="150px" width="100%" />
          </div>
        ) : content && (
          <div style={pageStyle}>
            {/* PORTADA / ENCABEZADO */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontWeight: 'bold' }}>REPÚBLICA BOLIVARIANA DE VENEZUELA</div>
              <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS</div>
              <div style={h1Style}>{content.portada.unidadOrganizativa}</div>
              <div style={h1Style}>{content.portada.tituloActuacion}</div>
              <div style={h1Style}>{content.portada.tipoInforme}</div>
            </div>

            {/* Mapeo Dinámico según el tipo de informe */}
            {type === 'ejecutivo' ? (
              <>
                <h2 style={h2Style}>1. Objetivo General</h2>
                <p style={pStyle}>{content.objetivoGeneral}</p>

                <h2 style={h2Style}>2. Alcance</h2>
                <p style={pStyle}>{content.alcance}</p>

                <h2 style={h2Style}>3. Observaciones Relevantes</h2>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', textAlign: 'justify' }}>
                  {content.observacionesRelevantes.map((obs, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{obs}</li>
                  ))}
                </ul>

                <h2 style={h2Style}>4. Conclusión</h2>
                <p style={pStyle}>{content.conclusion}</p>

                <h2 style={h2Style}>5. Recomendaciones</h2>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', textAlign: 'justify' }}>
                  {content.recomendaciones.map((rec, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                {/* CAPÍTULO I */}
                <h2 style={h2Style}>Capítulo I: Aspectos Preliminares</h2>
                <h3 style={h3Style}>1.1. Origen de la Actuación</h3>
                <p style={pStyle}>{content.capitulo1.origen}</p>
                
                <h3 style={h3Style}>1.2. Alcance</h3>
                <p style={pStyle}>{content.capitulo1.alcance}</p>

                <h3 style={h3Style}>1.3. Objetivos</h3>
                <p style={pStyle}><strong>Objetivo General:</strong> {content.capitulo1.objetivos.general}</p>
                <p style={pStyle}><strong>Objetivos Específicos:</strong></p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  {content.capitulo1.objetivos.especificos.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>

                <h3 style={h3Style}>1.4. Enfoque</h3>
                <p style={pStyle}>{content.capitulo1.enfoque}</p>

                <h3 style={h3Style}>1.5. Métodos, Procedimientos y Técnicas</h3>
                <p style={pStyle}>{content.capitulo1.metodos}</p>

                {/* CAPÍTULO II */}
                <h2 style={h2Style}>Capítulo II: Características Generales del Objeto Evaluado</h2>
                <p style={pStyle}><strong>2.1. Creación:</strong> {content.capitulo2.creacion}</p>
                <p style={pStyle}><strong>2.4. Organización (Organigrama):</strong> {content.capitulo2.organigrama}</p>
                <p style={pStyle}><strong>2.5. Base Legal y Técnica:</strong> {content.capitulo2.baseLegal}</p>

                {/* CAPÍTULO III */}
                <h2 style={h2Style}>Capítulo III: Observaciones Derivadas del Análisis</h2>
                {content.capitulo3.map((hallazgo, idx) => (
                  <div key={idx} style={{ marginBottom: '2rem' }}>
                    <p style={pStyle}><strong>Observación Nro {idx + 1}:</strong> {hallazgo.titulo}</p>
                    <p style={pStyle}><em>Condición:</em> {hallazgo.condicion}</p>
                    <p style={pStyle}><em>Criterio:</em> {hallazgo.criterio}</p>
                    <p style={pStyle}><em>Causa:</em> {hallazgo.causa}</p>
                    <p style={pStyle}><em>Efecto:</em> {hallazgo.efecto}</p>
                  </div>
                ))}

                {/* CAPÍTULO IV (Solo Definitivo) */}
                {isDefinitive && (
                  <>
                    <h2 style={h2Style}>Capítulo IV: Conclusión y Recomendaciones</h2>
                    <p style={pStyle}><strong>Conclusión:</strong> {content.capitulo4.conclusion}</p>
                    <p style={pStyle}><strong>Recomendaciones:</strong></p>
                    <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                      {content.capitulo4.recomendaciones.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                  </>
                )}
              </>
            )}

            {/* BLOQUE DE FIRMA (Evitando viudas/huérfanas visualmente añadiendo un margen superior grande) */}
            {isDefinitive ? (
              <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {isSigned ? (
                  report.definitive.signType === 'digital' ? (
                    // Firma Digital Simulada
                    <div style={{ border: '2px solid var(--brand-accent)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#F0F9FF', color: 'var(--brand-primary)' }}>
                      <QrCode size={64} />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>FIRMADO DIGITALMENTE POR:</div>
                        <div style={{ fontSize: '14pt', fontWeight: 'bold', margin: '0.25rem 0' }}>{report.definitive.signedBy}</div>
                        <div style={{ fontSize: '10pt' }}>{content.portada.unidadOrganizativa}</div>
                        <div style={{ fontSize: '8pt', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Hash de integridad: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                      </div>
                    </div>
                  ) : (
                    // Firma Física (Espacio en blanco)
                    <div style={{ width: '300px', textAlign: 'center' }}>
                      <div style={{ borderBottom: '1px solid black', height: '80px', marginBottom: '0.5rem' }}></div>
                      <div style={{ fontWeight: 'bold' }}>{report.definitive.signedBy}</div>
                      <div style={{ fontWeight: 'bold' }}>Cargo: {content.pieFirma.firmanteCargo}</div>
                      <div style={{ fontSize: '10pt', marginTop: '0.25rem' }}>Designado según Resolución N° XXXX-XX</div>
                    </div>
                  )
                ) : (
                  // Borrador sin firma
                  <div style={{ width: '300px', textAlign: 'center', opacity: 0.5 }}>
                    <div style={{ borderBottom: '1px dashed black', height: '80px', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '0.5rem' }}>
                      [Espacio reservado para firma]
                    </div>
                    <div style={{ fontWeight: 'bold' }}>{content.pieFirma.firmanteNombre}</div>
                    <div style={{ fontWeight: 'bold' }}>Cargo: {content.pieFirma.firmanteCargo}</div>
                    <div style={{ fontSize: '10pt', marginTop: '0.25rem' }}>Designado según Resolución N° XXXX-XX</div>
                  </div>
                )}
              </div>
            ) : (
              // Pie de página para Informe Preliminar
              <div style={{ marginTop: '5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '10pt' }}>
                <p style={{ margin: 0 }}>{content.portada.unidadOrganizativa}</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{content.pieFirma.institucion}</p>
              </div>
            )}

          </div>
        )}
      </div>
    </Modal>
  );
};
