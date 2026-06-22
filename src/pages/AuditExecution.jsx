import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChecklistAccordion } from '../components/audit/ChecklistAccordion';
import { checklistService } from '../services/checklistService';
import { Modal } from '../components/ui/Modal';
import { findingService } from '../services/findingService';
import { storageService } from '../services/storageService';
import { auditService } from '../services/auditService';

import { useAppContext } from '../context/AppContext';
import { Wifi, WifiOff, Database, Save, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AuditExecution = () => {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Organizacionales');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeAudit, setActiveAudit] = useState(null);
  
  // Load/Save Modal States
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [loadCode, setLoadCode] = useState('');
  const [searchError, setSearchError] = useState('');

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
    // Buscar la última auditoría creada para vincular la ejecución
    auditService.getAll().then(audits => {
      if (audits && audits.length > 0) {
        // Ordenar por fecha de creación descendente para tomar la más reciente
        const sorted = audits.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        const latest = sorted[0];
        setActiveAudit(latest);
        
        checklistService.getChecklistForAudit(latest.id).then(data => {
          setControls(data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleLoadAudit = async () => {
    setSearchError('');
    if (!loadCode.trim()) {
      setSearchError('Por favor ingrese un código');
      return;
    }
    
    setLoading(true);
    try {
      const audits = await auditService.getAll();
      const foundAudit = audits.find(a => 
        a.codigo?.toLowerCase() === loadCode.toLowerCase() || 
        a.id.toLowerCase() === loadCode.toLowerCase()
      );

      if (foundAudit) {
        setActiveAudit(foundAudit);
        const data = await checklistService.getChecklistForAudit(foundAudit.id);
        setControls(data);
        setIsLoadModalOpen(false);
        setLoadCode('');
        addNotification(`Actuación ${foundAudit.codigo || foundAudit.id} cargada exitosamente`, 'success');
      } else {
        setSearchError('No se encontró ninguna actuación con ese código');
      }
    } catch (err) {
      setSearchError('Error al buscar la actuación');
    }
    setLoading(false);
  };

  const handleSaveProgress = () => {
    if (!activeAudit) return;
    const codeToRemember = activeAudit.codigo || activeAudit.id;
    addNotification(`Progreso guardado automáticamente. Código de acceso para retomar luego: ${codeToRemember}`, 'success');
  };

  const handleUpdateControl = async (id, updateData) => {
    if (!activeAudit) return;
    // Autoguardado: llamamos al servicio y actualizamos el estado local
    await checklistService.updateControl(activeAudit.id, id, updateData);
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
            activeAudit.id,
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
        auditId: activeAudit.id,
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
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '1rem', boxSizing: 'border-box' }}>
        {/* Header Skeleton */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton" style={{ height: '32px', width: '300px', maxWidth: '100%', marginBottom: '0.75rem', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '18px', width: '450px', maxWidth: '100%', marginBottom: '1.5rem', borderRadius: '4px' }} />
          
          {/* Progress Card Skeleton */}
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--surface-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '18px', width: '150px', maxWidth: '100%', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '18px', width: '80px', borderRadius: '4px' }} />
            </div>
            <div className="skeleton" style={{ height: '8px', width: '100%', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '40px', width: '120px', flexShrink: 0, borderRadius: 'var(--radius-full)' }} />
          ))}
        </div>

        {/* Accordions Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: '1.25rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-card)', minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div className="skeleton" style={{ width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 }} />
                <div className="skeleton" style={{ height: '20px', width: '300px', maxWidth: '100%', borderRadius: '4px' }} />
              </div>
              <div className="skeleton" style={{ height: '20px', width: '50px', flexShrink: 0, borderRadius: '4px' }} />
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Cabecera y Progreso Global */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--font-size-h1)' }}>Ejecución ISO 27001:2022</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Auditoría activa: {activeAudit ? activeAudit.title : 'Cargando...'} 
              {activeAudit && activeAudit.codigo && ` (Código: ${activeAudit.codigo})`}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setIsLoadModalOpen(true)}>
              <Search size={18} style={{ marginRight: '8px' }} />
              Cargar Actuación
            </Button>
            <Button variant="primary" onClick={handleSaveProgress}>
              <Save size={18} style={{ marginRight: '8px' }} />
              Guardar Progreso
            </Button>
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

      {/* Modal para Cargar Actuación */}
      <Modal
        isOpen={isLoadModalOpen}
        onClose={() => { setIsLoadModalOpen(false); setSearchError(''); setLoadCode(''); }}
        title="Continuar Actuación Existente"
      >
        <div style={{ padding: '1rem 0' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Ingrese el código de la actuación fiscal o el ID del sistema para cargar el progreso guardado anteriormente.
          </p>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
            Código de Actuación
          </label>
          <input
            type="text"
            value={loadCode}
            onChange={(e) => { setLoadCode(e.target.value); setSearchError(''); }}
            placeholder="Ej. ACT-2026-001 o AUD-..."
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-button)',
              border: `1px solid ${searchError ? 'var(--status-critical)' : 'var(--border-light)'}`,
              backgroundColor: 'var(--surface-light)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              marginBottom: '0.5rem'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLoadAudit();
            }}
          />
          {searchError && (
            <span style={{ color: 'var(--status-critical)', fontSize: '0.85rem' }}>{searchError}</span>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Button variant="outline" onClick={() => { setIsLoadModalOpen(false); setSearchError(''); setLoadCode(''); }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleLoadAudit}>
              Buscar y Cargar
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
