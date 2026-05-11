import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Stepper } from '../components/ui/Stepper';
import { Step1GeneralData } from '../components/planning/Step1GeneralData';
import { Step2AuditTeam } from '../components/planning/Step2AuditTeam';
import { Step3RiskMatrix } from '../components/planning/Step3RiskMatrix';
import { Step4Review } from '../components/planning/Step4Review';
import { auditService } from '../services/auditService';
import { useAppContext } from '../context/AppContext';
import { Plus, ArrowLeft, ArrowRight, FileText } from 'lucide-react';

export const AuditPlanning = () => {
  const [isWizardActive, setIsWizardActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { addNotification } = useAppContext();

  // Estado centralizado del Wizard
  const [wizardData, setWizardData] = useState({
    general: {
      codigo: '',
      institucion: '',
      alcanceDesde: '',
      alcanceHasta: '',
      objetivo: '',
      tipo: 'Seguridad de la Información',
      // Mantenemos campos legacy temporales para no romper componentes aún no actualizados
      destinatarioNombre: '',
      destinatarioCargo: '',
      destinatarioDireccion: '',
      oficioNro: ''
    },
    team: [],
    cronograma: { inicio: '', fin: '' },
    riesgos: []
  });

  const steps = [
    { label: 'Datos de la Auditoría' },
    { label: 'Equipo y Tiempos' },
    { label: 'Análisis de Riesgos' },
    { label: 'Revisión y Emisión' }
  ];

  const handleNextStep = () => {
    // Validaciones básicas antes de avanzar
    if (currentStep === 1) {
      if (!wizardData.general.institucion || !wizardData.general.objetivo) {
        addNotification('Por favor, complete al menos la Institución y el Objetivo.', 'warning');
        return;
      }
    }
    if (currentStep === 2 && wizardData.team.length === 0) {
      addNotification('Debe asignar al menos un miembro a la comisión.', 'warning');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalize = async () => {
    // Generar la auditoría en la BD simulada
    const newAudit = {
      title: 'Auditoría a ' + wizardData.general.institucion,
      entity: wizardData.general.institucion,
      progress: 0,
      tasksTotal: 93,
      tasksCompleted: 0,
      status: 'open',
      team: wizardData.team.map(m => m.nombre)
    };

    await auditService.create(newAudit);
    addNotification('Auditoría generada con éxito (Oficio y Matriz).', 'success');
    
    // Resetear Wizard
    setIsWizardActive(false);
    setCurrentStep(1);
    setWizardData({
      general: { codigo: '', institucion: '', alcanceDesde: '', alcanceHasta: '', objetivo: '', tipo: 'Seguridad de la Información', destinatarioNombre: '', destinatarioCargo: '', destinatarioDireccion: '', oficioNro: '' },
      team: [],
      cronograma: { inicio: '', fin: '' },
      riesgos: []
    });
  };

  // Vista Inicial (Start Screen)
  if (!isWizardActive) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh', textAlign: 'center' }}>
        <FileText size={64} color="var(--brand-accent)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
        <h1 style={{ marginBottom: '1rem' }}>Planificación de Auditorías</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem', lineHeight: '1.6' }}>
          Desde este módulo podrás iniciar nuevas actuaciones fiscales, conformar las comisiones de trabajo y generar los oficios de presentación con firma electrónica.
        </p>
        <Button variant="primary" onClick={() => setIsWizardActive(true)} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          <Plus size={20} style={{ marginRight: '8px' }} />
          Iniciar Nueva Actuación
        </Button>
      </div>
    );
  }

  // Vista del Wizard
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Cabecera del Wizard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Planificación de la Auditoría</h2>
      </div>

      {/* Indicador de Progreso */}
      <Stepper currentStep={currentStep} steps={steps} />

      {/* Contenido del Paso Actual */}
      <div style={{ minHeight: '400px' }}>
        {currentStep === 1 && (
          <Step1GeneralData 
            data={wizardData.general} 
            updateData={(newData) => setWizardData({ ...wizardData, general: newData })} 
          />
        )}
        {currentStep === 2 && (
          <Step2AuditTeam 
            teamData={wizardData.team}
            generalData={wizardData.general}
            cronograma={wizardData.cronograma}
            updateTeam={(newData) => setWizardData({ ...wizardData, team: newData })} 
            updateGeneral={(newData) => setWizardData({ ...wizardData, general: newData })}
            updateCronograma={(newData) => setWizardData({ ...wizardData, cronograma: newData })}
          />
        )}
        {currentStep === 3 && (
          <Step3RiskMatrix 
            riesgos={wizardData.riesgos}
            updateRiesgos={(newData) => setWizardData({ ...wizardData, riesgos: newData })}
          />
        )}
        {currentStep === 4 && (
          <Step4Review 
            generalData={wizardData.general} 
            teamData={wizardData.team}
            riesgos={wizardData.riesgos}
            updateGeneralData={(newData) => setWizardData({ ...wizardData, general: newData })} 
            onSignAndGenerate={handleFinalize}
          />
        )}
      </div>

      {/* Controles de Navegación del Wizard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={() => setIsWizardActive(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePrevStep} 
            disabled={currentStep === 1}
          >
            <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Regresar
          </Button>
        </div>
        
        {currentStep < 4 && (
          <Button variant="primary" onClick={handleNextStep}>
            Siguiente <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Button>
        )}
      </div>

    </div>
  );
};
