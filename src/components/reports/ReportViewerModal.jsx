import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { reportService } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';
import { Download, FileSignature, CheckCircle, QrCode } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { generateDocx } from '../../utils/docxExport';
import { InstitutionalDocumentLayout } from '../document/InstitutionalDocumentLayout';

export const ReportViewerModal = ({ isOpen, onClose, report, type, onOpenSignatureModal, onApproveExecutive }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const contentRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isOpen && report) {
      setLoading(true);
      reportService.generateReportData(report.auditId, type, report).then(data => {
        setContent(data);
        setLoading(false);
      });
    }
  }, [isOpen, report, type]);

  if (!isOpen || !report) return null;

  const isDefinitive = type === 'definitivo' || type === 'definitivo_edit';
  const isSigned = report.definitive?.status === 'firmado';
  const canSign = isDefinitive && !isSigned && (currentUser?.role === 'contralor' || currentUser?.role === 'auditor');
  const isExecutiveApproved = report.executive?.status === 'aprobado';

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !content) return;
    setDownloadingFormat('pdf');
    
    // Guardamos el padding original y lo quitamos para que no se sume al margen del PDF
    const originalPadding = contentRef.current.style.padding;
    contentRef.current.style.padding = '0';

    try {
      const opt = {
        margin:       [30, 30, 30, 30], // 30mm (3cm) de margen en TODAS las páginas
        filename:     `Informe_${type.charAt(0).toUpperCase() + type.slice(1)}_${report.auditId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' },
        pagebreak:    { mode: 'avoid-all' }
      };
      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (err) {
      console.error("Error al generar PDF", err);
    } finally {
      // Restauramos el padding visual de la web
      contentRef.current.style.padding = originalPadding;
      setDownloadingFormat(null);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!content) return;
    setDownloadingFormat('docx');
    try {
      await generateDocx(content, type, report);
    } catch (err) {
      console.error("Error al generar DOCX", err);
    } finally {
      setDownloadingFormat(null);
    }
  };

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

  const ensureArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim() !== '') return [val];
    return [];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Vista Previa: Informe ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
      
      {/* Toolbar superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge status="default">{report.auditId}</Badge>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Estado: {isDefinitive && isSigned ? 'Firmado' : type === 'ejecutivo' ? (isExecutiveApproved ? 'Aprobado' : 'Generado / Pendiente Aprobación') : 'Borrador'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={handleDownloadDOCX} disabled={downloadingFormat !== null || loading}>
            <Download size={16} style={{ marginRight: '8px' }} /> {downloadingFormat === 'docx' ? 'Generando...' : 'DOCX'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={downloadingFormat !== null || loading}>
            <Download size={16} style={{ marginRight: '8px' }} /> {downloadingFormat === 'pdf' ? 'Generando...' : 'PDF'}
          </Button>
          {type === 'ejecutivo' && !isExecutiveApproved && (
            <Button variant="primary" size="sm" onClick={() => onApproveExecutive?.(report)} disabled={loading}>
              <CheckCircle size={16} style={{ marginRight: '8px' }} /> Aprobar Documento
            </Button>
          )}
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
          <InstitutionalDocumentLayout isScreen={true} ref={contentRef}>
            {/* PORTADA DEL INFORME (Primer bloque del cuerpo) */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={h1Style}>{content.portada?.unidadOrganizativa || ''}</div>
              <div style={h1Style}>{content.portada?.tituloActuacion || ''}</div>
              <div style={h1Style}>{content.portada?.tipoInforme || ''}</div>
            </div>

            {/* Mapeo Dinámico según el tipo de informe */}
            {type === 'ejecutivo' ? (
              <>
                <h2 style={h2Style}>1. Objetivo General</h2>
                <p style={pStyle}>{content.objetivoGeneral || ''}</p>

                <h2 style={h2Style}>2. Alcance</h2>
                <p style={pStyle}>{content.alcance || ''}</p>

                <h2 style={h2Style}>3. Observaciones Relevantes</h2>
                <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                  {ensureArray(content.observacionesRelevantes).map((obs, idx) => (
                    <p key={idx} style={{ ...pStyle, marginBottom: '0.5rem' }}>{obs}</p>
                  ))}
                </div>

                <h2 style={h2Style}>4. Conclusión</h2>
                <p style={pStyle}>{content.conclusion || ''}</p>

                <h2 style={h2Style}>5. Recomendaciones</h2>
                <div style={{ marginBottom: '1rem' }}>
                  {ensureArray(content.recomendaciones).map((rec, idx) => (
                    <p key={idx} style={{ ...pStyle, marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>{rec}</p>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* CAPÍTULO I */}
                <h2 style={h2Style}>Capítulo I: Aspectos Preliminares</h2>
                <h3 style={h3Style}>1.1. Origen de la Actuación</h3>
                <p style={pStyle}>{content.capitulo1?.origen || ''}</p>
                
                <h3 style={h3Style}>1.2. Alcance</h3>
                <p style={pStyle}>{typeof content.capitulo1?.alcance === 'string' ? content.capitulo1.alcance.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, '$3-$2-$1') : (content.capitulo1?.alcance || '')}</p>

                <h3 style={h3Style}>1.3. Objetivos</h3>
                <p style={pStyle}><strong>Objetivo General:</strong> {content.capitulo1?.objetivos?.general || ''}</p>
                <p style={pStyle}><strong>Objetivos Específicos:</strong></p>
                <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                  {ensureArray(content.capitulo1?.objetivos?.especificos).map((obj, i) => (
                    <p key={i} style={{ ...pStyle, marginBottom: '0.25rem' }}>{obj}</p>
                  ))}
                </div>

                <h3 style={h3Style}>1.4. Enfoque</h3>
                <p style={pStyle}>{content.capitulo1?.enfoque || ''}</p>

                <h3 style={h3Style}>1.5. Métodos, Procedimientos y Técnicas</h3>
                <p style={pStyle}>{content.capitulo1?.metodos || ''}</p>

                {/* CAPÍTULO II */}
                <h2 style={h2Style}>Capítulo II: Características Generales del Objeto Evaluado</h2>
                <h3 style={h3Style}>2.1. Creación</h3>
                <p style={pStyle}>{content.capitulo2?.creacion || ''}</p>

                <h3 style={h3Style}>2.2. Base Legal y Técnica</h3>
                <p style={pStyle}>{content.capitulo2?.baseLegal || ''}</p>

                {/* CAPÍTULO III */}
                <h2 style={h2Style}>Capítulo III: Observaciones Derivadas del Análisis</h2>
                {!ensureArray(content.capitulo3).length ? (
                  <p style={{ ...pStyle, fontStyle: 'italic' }}>No se registraron observaciones derivadas del análisis.</p>
                ) : (
                  ensureArray(content.capitulo3).map((h, i) => (
                    <div key={i} style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem', borderLeft: '3px solid #1E3A8A' }}>
                      <p style={{ ...pStyle, fontWeight: 'bold', color: '#1E3A8A' }}>3.{i + 1}. Condición: {h.condicion}</p>
                      <p style={pStyle}><strong>Criterio:</strong> {h.criterio}</p>
                      <p style={pStyle}><strong>Causa:</strong> {h.causa}</p>
                      <p style={pStyle}><strong>Efecto:</strong> {h.efecto}</p>
                    </div>
                  ))
                )}

                {/* CAPÍTULO IV (Solo Definitivo) */}
                {isDefinitive && (
                  <>
                    <h2 style={h2Style}>Capítulo IV: Conclusión y Recomendaciones</h2>
                    <p style={pStyle}><strong>Conclusión:</strong> {content.capitulo4?.conclusion || ''}</p>
                    <p style={pStyle}><strong>Recomendaciones:</strong></p>
                    <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                      {ensureArray(content.capitulo4?.recomendaciones).map((rec, i) => <p key={i} style={{ ...pStyle, marginBottom: '0.5rem' }}>{rec}</p>)}
                    </div>
                  </>
                )}
              </>
            )}

            {/* BLOQUE DE FIRMA (Evitando viudas/huérfanas visualmente añadiendo un margen superior grande) */}
            {isDefinitive && (
              <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {isSigned ? (
                  // Firma Oficial Estampada
                  <div style={{ width: '420px', textAlign: 'center' }}>
                    <div style={{ borderBottom: '1px solid black', height: '80px', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '4px' }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '18pt', color: '#1E3A8A' }}>{report.definitive?.signedBy || content.pieFirma.firmanteNombre}</span>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>{report.definitive?.signedBy || content.pieFirma.firmanteNombre}</div>
                    <div style={{ fontWeight: 'bold' }}>Cargo: {content.pieFirma.firmanteCargo}</div>
                    <div style={{ fontSize: '10pt', marginTop: '0.25rem', color: '#334155' }}>{content.pieFirma.acta || 'Acta de Sesión Extraordinaria Nro. 003-2019 de fecha 15-05-2019'}</div>
                    <div style={{ fontSize: '10pt', color: '#334155' }}>{content.pieFirma.publicacion || 'Gaceta Municipal Nro 1025 de fecha 15-05-2019'}</div>
                  </div>
                ) : (
                  // Borrador sin firma
                  <div style={{ width: '420px', textAlign: 'center', opacity: 0.6 }}>
                    <div style={{ borderBottom: '1px dashed black', height: '80px', marginBottom: '0.5rem' }}></div>
                    <div style={{ fontWeight: 'bold' }}>{content.pieFirma.firmanteNombre}</div>
                    <div style={{ fontWeight: 'bold' }}>Cargo: {content.pieFirma.firmanteCargo}</div>
                    <div style={{ fontSize: '10pt', marginTop: '0.25rem' }}>{content.pieFirma.acta || 'Acta de Sesión Extraordinaria Nro. 003-2019 de fecha 15-05-2019'}</div>
                    <div style={{ fontSize: '10pt' }}>{content.pieFirma.publicacion || 'Gaceta Municipal Nro 1025 de fecha 15-05-2019'}</div>
                  </div>
                )}
              </div>
            )}
          </InstitutionalDocumentLayout>
        )}
      </div>
    </Modal>
  );
};
