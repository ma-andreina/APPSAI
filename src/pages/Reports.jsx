import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportViewerModal } from '../components/reports/ReportViewerModal';
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
    setSelectedType(type);
    setViewerOpen(true);
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
      // Opcional: Reabrir el visor para ver la firma estampada
      // setViewerOpen(true); 
    } catch (error) {
      addNotification('Error al firmar el informe', 'error');
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
              Generación de documentos estructurados y aplicación de firma electrónica.
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
             No hay informes generados actualmente.
           </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
            {reports.map((report) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onPreview={handlePreview} 
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
