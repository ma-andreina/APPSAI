import React, { useState, useEffect } from 'react';
import { pacService } from '../services/pacService';
import { reportService } from '../services/reportService';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ClipboardList, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PACWizardModal } from '../components/pac/PACWizardModal';

export const PACManagement = () => {
  const [reports, setReports] = useState([]);
  const [pacs, setPacs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useAppContext();

  // Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allReports = await reportService.getAll();
      const allPacs = await pacService.getAllPACs();
      
      // Filtramos solo las auditorías que tienen informe definitivo (requisito para el PAC)
      const validReports = allReports.filter(r => r.definitive.status !== 'pendiente');
      
      setReports(validReports);
      setPacs(allPacs);
    } catch (error) {
      addNotification('Error al cargar datos del PAC', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPacStatus = (auditId) => {
    const pac = pacs.find(p => p.auditId === auditId);
    if (!pac) return { text: 'No Iniciado', color: 'default' };
    if (pac.status === 'Conformado') return { text: 'Conformado', color: 'closed' };
    return { text: 'En Borrador', color: 'in-progress' };
  };

  const openWizard = (auditId) => {
    setSelectedAuditId(auditId);
    setWizardOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: 'var(--status-critical)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: 'var(--radius-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>Gestor de Seguimiento y Acciones (PAC)</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Seguimiento a las recomendaciones emitidas en el Informe Definitivo.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Auditorías Elegibles */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            <Skeleton height="150px" borderRadius="var(--radius-card)" />
            <Skeleton height="150px" borderRadius="var(--radius-card)" />
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
             No hay auditorías con Informe Definitivo para registrar planes de acción.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {reports.map(report => {
              const pacStatus = getPacStatus(report.auditId);
              return (
                <Card key={report.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    {report.auditId}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{report.auditTitle}</h3>
                  <div style={{ color: 'var(--brand-accent)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {report.entity}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                    <Badge status={pacStatus.color}>{pacStatus.text}</Badge>
                    <Button variant="primary" size="sm" onClick={() => openWizard(report.auditId)}>
                      Gestionar PAC <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      {selectedAuditId && (
        <PACWizardModal 
          isOpen={wizardOpen}
          onClose={() => { setWizardOpen(false); fetchData(); }}
          auditId={selectedAuditId}
        />
      )}

    </div>
  );
};
