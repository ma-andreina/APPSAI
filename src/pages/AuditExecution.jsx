import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChecklistAccordion } from '../components/audit/ChecklistAccordion';
import { checklistService } from '../services/checklistService';
import { Modal } from '../components/ui/Modal';
import { FindingForm } from '../components/audit/FindingForm';
import { findingService } from '../services/findingService';
import { storageService } from '../services/storageService';
import { useAppContext } from '../context/AppContext';
import { Wifi, WifiOff, Database } from 'lucide-react';

export const AuditExecution = () => {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Organizacionales');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
  
  // Estados para el Modal de Hallazgos
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
  const [selectedControlForFinding, setSelectedControlForFinding] = useState(null);
  const { addNotification } = useAppContext();

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification('Conexión restablecida. Sincronizando datos...', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addNotification('Sin conexión. Trabajando en modo local caché.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  useEffect(() => {
    // Cargar el checklist de la auditoría activa
    checklistService.getChecklistForAudit('AUD-ACTIVE').then(data => {
      setControls(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateControl = async (id, updateData) => {
    // Autoguardado: llamamos al servicio y actualizamos el estado local
    await checklistService.updateControl('AUD-ACTIVE', id, updateData);
    setControls(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
  };

  const handleTriggerFinding = (control) => {
    setSelectedControlForFinding(control);
    setIsFindingModalOpen(true);
  };

  const handleSaveFinding = async (formData) => {
    setIsFindingModalOpen(false);

    // Subir evidencias si existen archivos adjuntos
    const uploadedEvidences = [];
    if (formData.evidence && formData.evidence.length > 0) {
      addNotification('Procesando evidencias y calculando hashes SHA-256...', 'info');
      for (const fileObj of formData.evidence) {
        try {
          const evidenceMeta = await storageService.uploadEvidence(
            fileObj,
            'AUD-ACTIVE',
            selectedControlForFinding.id
          );
          uploadedEvidences.push(evidenceMeta);
        } catch (err) {
          console.error('Error al subir evidencia:', err);
          addNotification(`Error al subir: ${fileObj.name}`, 'error');
        }
      }
    }

    try {
      await findingService.create({
        ...formData,
        evidenceFiles: uploadedEvidences,
        auditId: 'AUD-ACTIVE',
        controlId: selectedControlForFinding.id,
        title: `Desviación en Control A.${selectedControlForFinding.id}`
      });
      addNotification('Hallazgo registrado y vinculado al control exitosamente', 'success');
    } catch (err) {
      console.error('Error al guardar hallazgo:', err);
      addNotification('Error al registrar el hallazgo', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
        {/* Header Skeleton */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton" style={{ height: '32px', width: '300px', marginBottom: '0.75rem', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '18px', width: '450px', marginBottom: '1.5rem', borderRadius: '4px' }} />
          
          {/* Progress Card Skeleton */}
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div className="skeleton" style={{ height: '18px', width: '150px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '18px', width: '80px', borderRadius: '4px' }} />
            </div>
            <div className="skeleton" style={{ height: '8px', width: '100%', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '40px', width: '120px', borderRadius: 'var(--radius-full)' }} />
          ))}
        </div>

        {/* Accordions Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: '1.25rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-card)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="skeleton" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                <div className="skeleton" style={{ height: '20px', width: '300px', borderRadius: '4px' }} />
              </div>
              <div className="skeleton" style={{ height: '20px', width: '50px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Cálculos de progreso global
  const totalControls = controls.length;
  const evaluatedControls = controls.filter(c => c.status !== null).length;
  const globalProgress = Math.round((evaluatedControls / totalControls) * 100) || 0;

  // Categorías fijas de la ISO 27001
  const categories = [
    { id: 'Organizacionales', label: 'Organizacionales' },
    { id: 'Personas', label: 'Personas' },
    { id: 'Físicos', label: 'Físicos' },
    { id: 'Tecnológicos', label: 'Tecnológicos' }
  ];

  // Preparar Tabs con sus badges (evaluados / total en esa categoría)
  const tabs = categories.map(cat => {
    const catControls = controls.filter(c => c.category === cat.id);
    const catEvaluated = catControls.filter(c => c.status !== null).length;
    return {
      ...cat,
      badge: `${catEvaluated}/${catControls.length}`
    };
  });

  // Filtrar controles para la vista actual
  const visibleControls = controls.filter(c => c.category === activeCategory);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Cabecera y Progreso Global */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>Ejecución ISO 27001:2022</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Auditoría activa: Evaluación de Seguridad BD (Alcaldía de Pedraza)
            </p>
          </div>
          
          {/* Indicador de Estado de Conexión/Sincronización */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: !isFirebaseConfigured ? '#3B82F61A' : isOnline ? '#10B9811A' : '#F5A6231A',
            color: !isFirebaseConfigured ? '#3B82F6' : isOnline ? '#10B981' : '#F5A623',
            border: `1px solid ${!isFirebaseConfigured ? '#3B82F64D' : isOnline ? '#10B9814D' : '#F5A6234D'}`,
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            {!isFirebaseConfigured ? <Database size={14} /> : isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            {!isFirebaseConfigured ? 'Simulación (Local)' : isOnline ? 'Conectado (Servidor)' : 'Sin Conexión (Caché Local)'}
          </div>
        </div>

        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600' }}>Progreso de Evaluación</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {evaluatedControls} de {totalControls} controles completados
            </span>
          </div>
          <ProgressBar progress={globalProgress} color="var(--brand-accent)" />
        </Card>
      </div>

      {/* Navegación por Pestañas */}
      <Tabs 
        tabs={tabs} 
        activeTab={activeCategory} 
        onTabChange={setActiveCategory} 
      />

      {/* Listado de Controles (Acordeones) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {visibleControls.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No hay controles disponibles en esta categoría.
          </div>
        ) : (
          visibleControls.map(control => (
            <ChecklistAccordion 
              key={control.id} 
              control={control} 
              onUpdate={handleUpdateControl}
              onTriggerFinding={handleTriggerFinding}
            />
          ))
        )}
      </div>

      {/* Modal de Creación Rápida de Hallazgos */}
      <Modal 
        isOpen={isFindingModalOpen} 
        onClose={() => setIsFindingModalOpen(false)} 
        title={`Registrar Hallazgo - Control A.${selectedControlForFinding?.id}`}
      >
        {selectedControlForFinding && (
          <FindingForm 
            onSubmit={handleSaveFinding} 
            onCancel={() => setIsFindingModalOpen(false)}
            initialData={{
              criterion: `Control ISO 27001 A.${selectedControlForFinding.id} - ${selectedControlForFinding.title}:\n"${selectedControlForFinding.description}"`,
              cause: selectedControlForFinding.observations || ''
            }}
          />
        )}
      </Modal>

    </div>
  );
};
