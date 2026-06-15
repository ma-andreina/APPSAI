import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { pacService } from '../../services/pacService';
import { useAppContext } from '../../context/AppContext';
import { PACStep1Base } from './PACStep1Base';
import { PACStep2Grid } from './PACStep2Grid';
import { PACStep3Signatures } from './PACStep3Signatures';
import { PACViewerModal } from './PACViewerModal';
import { Skeleton } from '../ui/Skeleton';

export const PACWizardModal = ({ isOpen, onClose, auditId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [baseData, setBaseData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [pac, setPac] = useState(null);

  // Viewer State
  const [viewerOpen, setViewerOpen] = useState(false);

  const { addNotification } = useAppContext();

  useEffect(() => {
    if (isOpen && auditId) {
      loadData();
    }
  }, [isOpen, auditId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await pacService.getPACDataByAudit(auditId);
      setBaseData(data.baseData);
      setRecommendations(data.recommendations);
      setPac(data.pac);
      setCurrentStep(1); // Reset step on open
    } catch (error) {
      addNotification('Error al cargar datos del PAC', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSaveAction = async (actionData) => {
    // Busca si la acción ya existe y la actualiza, o la agrega
    const updatedActions = [...pac.actions];
    const index = updatedActions.findIndex(a => a.recommendationId === actionData.recommendationId);
    
    if (index > -1) {
      updatedActions[index] = actionData;
    } else {
      updatedActions.push(actionData);
    }

    const updatedPac = { ...pac, actions: updatedActions };
    setPac(updatedPac);
    
    // Auto-guardado Draft
    await pacService.saveDraft(updatedPac);
    addNotification('Progreso guardado (Auto-save)', 'success');
  };

  const handleSign = async (roleType, signatureData) => {
    try {
      const updatedPac = await pacService.signPAC(pac.id, roleType, signatureData);
      setPac(updatedPac);
      addNotification('Firma registrada exitosamente', 'success');
      if (roleType === 'conformed') {
        // Cierra el wizard automáticamente o muestra mensaje de éxito final
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      addNotification('Error al registrar firma', 'error');
    }
  };

  const isFormComplete = () => {
    // Verifica que todas las recomendaciones tengan una acción registrada (básico)
    return recommendations.every(r => pac.actions.some(a => a.recommendationId === r.id));
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Gestor de Plan de Acciones Correctivas (PAC)" size="xl">
        {loading ? (
          <div style={{ padding: '2rem' }}>
            <Skeleton height="40px" width="100%" style={{ marginBottom: '2rem' }} />
            <Skeleton height="200px" width="100%" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
            
            {/* Stepper Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem', paddingBottom: '1rem' }}>
              <StepIndicator step={1} currentStep={currentStep} label="Datos Base" />
              <StepIndicator step={2} currentStep={currentStep} label="Carga del Plan" />
              <StepIndicator step={3} currentStep={currentStep} label="Validación y Firmas" />
            </div>

            {/* Step Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {currentStep === 1 && <PACStep1Base baseData={baseData} />}
              {currentStep === 2 && (
                <PACStep2Grid 
                  recommendations={recommendations} 
                  actions={pac.actions} 
                  onSaveAction={handleSaveAction} 
                />
              )}
              {currentStep === 3 && (
                <PACStep3Signatures 
                  pac={pac} 
                  isFormComplete={isFormComplete()} 
                  onSign={handleSign} 
                  onPreview={() => setViewerOpen(true)}
                />
              )}
            </div>

            {/* Footer Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <Button variant="outline" onClick={currentStep === 1 ? onClose : handlePrev}>
                {currentStep === 1 ? 'Cancelar' : 'Atrás'}
              </Button>
              {currentStep < 3 ? (
                <Button variant="primary" onClick={handleNext}>
                  Siguiente
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setViewerOpen(true)}>
                  Vista Previa Documento
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Viewer Modal (Landscape) */}
      <PACViewerModal 
        isOpen={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
        pac={pac} 
        baseData={baseData}
        recommendations={recommendations}
      />
    </>
  );
};

// Subcomponente interno para el indicador visual de pasos
const StepIndicator = ({ step, currentStep, label }) => {
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1, opacity: isActive || isCompleted ? 1 : 0.5 }}>
      <div style={{ 
        width: '30px', 
        height: '30px', 
        borderRadius: '50%', 
        backgroundColor: isActive || isCompleted ? 'var(--brand-accent)' : 'var(--surface-hover)', 
        color: isActive || isCompleted ? 'white' : 'var(--text-secondary)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '10px'
      }}>
        {step}
      </div>
      <div style={{ fontWeight: isActive ? 'bold' : 'normal', color: 'var(--text-primary)' }}>{label}</div>
    </div>
  );
};
