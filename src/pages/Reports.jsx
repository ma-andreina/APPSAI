import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportViewerModal } from '../components/reports/ReportViewerModal';
import { DefinitiveReportEditorModal } from '../components/reports/DefinitiveReportEditorModal';
import { SignatureModal } from '../components/reports/SignatureModal';
import { Skeleton } from '../components/ui/Skeleton';
import { FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedType, setSelectedType] = useState('preliminar');

  const { addNotification } = useAppContext();
  const { currentUser } = useAuth();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getAll();
      setReports(data);
    } catch (error) {
      addNotification('Error al cargar informes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePreview = (report, type) => {
    setSelectedReport(report);
    if (type === 'definitivo_edit') {
      setEditorOpen(true);
      return;
    }
    setSelectedType(type);
    setViewerOpen(true);
  };

  const handleSaveChapter4 = async (reportId, auditId, chapter4Data) => {
    await reportService.saveDefinitiveChapter4(reportId, chapter4Data);
    setEditorOpen(false);
    fetchReports();
  };

  const handleOpenSignature = () => {
    setViewerOpen(false); // Cerramos el visor temporalmente para mostrar el PIN
    setSignatureOpen(true);
  };

  const handleSign = async (signType) => {
    try {
      await reportService.signReport(selectedReport.id, signType, currentUser?.name || 'Contralor Municipal');
      addNotification('Informe firmado exitosamente', 'success');
      setSignatureOpen(false);
      fetchReports();
    } catch (error) {
      addNotification('Error al firmar el informe', 'error');
    }
  };

  const handleApproveExecutive = async (rep) => {
    try {
      await reportService.approveExecutive(rep.id);
      addNotification('Resumen Ejecutivo aprobado exitosamente', 'success');
      fetchReports();
      setSelectedReport(prev => prev ? { ...prev, executive: { status: 'aprobado', date: new Date().toISOString().split('T')[0] } } : prev);
    } catch (err) {
      addNotification('Error al aprobar el Resumen Ejecutivo', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: 'var(--brand-accent)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: 'var(--radius-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>Repositorio de Informes</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Generación de documentos estructurados.
            </p>
          </div>
        </div>
      </div>

      {/* Content: Grid de Cards */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            <Skeleton height="250px" borderRadius="var(--radius-card)" />
            <Skeleton height="250px" borderRadius="var(--radius-card)" />
            <Skeleton height="250px" borderRadius="var(--radius-card)" />
          </div>
        ) : reports.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              No hay informes disponibles. Complete las fases de planificación y ejecución para generar informes.
           </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {reports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onPreview={handlePreview}
                onSign={handleOpenSignature}
              />
            ))}
          </div>
        )}
      </div>

      {/* Visor de Informes (Pantalla Completa Simulada) */}
      <ReportViewerModal 
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        report={selectedReport}
        type={selectedType}
        onOpenSignatureModal={handleOpenSignature}
        onApproveExecutive={handleApproveExecutive}
      />

      {/* Redacción y Edición de Informe Definitivo (Capítulo IV) */}
      <DefinitiveReportEditorModal 
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        report={selectedReport}
        onSaveAndPreview={handleSaveChapter4}
      />

      {/* Gatekeeper (Autorización de Firma por PIN) */}
      <SignatureModal 
        isOpen={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onSign={handleSign}
      />

    </div>
  );
};
