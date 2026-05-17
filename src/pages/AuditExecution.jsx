import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ChecklistAccordion } from '../components/audit/ChecklistAccordion';
import { checklistService } from '../services/checklistService';
import { Modal } from '../components/ui/Modal';
import { FindingForm } from '../components/audit/FindingForm';
import { findingService } from '../services/findingService';
import { useAppContext } from '../context/AppContext';

export const AuditExecution = () => {
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Organizacionales');
  
  // Estados para el Modal de Hallazgos
  const [isFindingModalOpen, setIsFindingModalOpen] = useState(false);
  const [selectedControlForFinding, setSelectedControlForFinding] = useState(null);
  const { addNotification } = useAppContext();

  useEffect(() => {
    // Simulamos que estamos cargando el checklist para la auditoría activa
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
    await findingService.create({ ...formData, auditId: 'AUD-ACTIVE' });
    addNotification('Hallazgo registrado y vinculado al control exitosamente', 'success');
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando checklist ISO 27001...</div>;
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
        <h1 style={{ margin: '0 0 0.5rem 0' }}>Ejecución ISO 27001:2022</h1>
        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)' }}>
          Auditoría activa: Evaluación de Seguridad BD (Alcaldía de Pedraza)
        </p>

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
