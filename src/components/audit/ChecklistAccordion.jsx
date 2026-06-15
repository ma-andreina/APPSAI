import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const ChecklistAccordion = ({ control, onUpdate, onTriggerFinding, autoSaveDelay = 1000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(control.status);
  const [localObservations, setLocalObservations] = useState(control.observations || '');
  const [isSaving, setIsSaving] = useState(false);

  // Autoguardado simulado con debounce
  useEffect(() => {
    if (localStatus === control.status && localObservations === control.observations) return;

    setIsSaving(true);
    const handler = setTimeout(() => {
      onUpdate(control.id, { status: localStatus, observations: localObservations }).then(() => {
        setIsSaving(false);
      });
    }, autoSaveDelay);

    return () => clearTimeout(handler);
  }, [localStatus, localObservations, control, onUpdate, autoSaveDelay]);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Status Styles
  const getStatusColor = (status) => {
    switch (status) {
      case 'Cumple': return 'var(--status-closed)';
      case 'No cumple': return 'var(--status-critical)';
      case 'N/A': return 'var(--text-secondary)';
      default: return 'var(--text-secondary)';
    }
  };

  const isPending = !localStatus;

  return (
    <div style={{ 
      border: `1px solid ${isOpen ? 'var(--brand-accent)' : 'var(--border-light)'}`,
      borderRadius: 'var(--radius-card)',
      marginBottom: '1rem',
      backgroundColor: 'var(--surface-card)',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease'
    }}>
      {/* Header del Acordeón */}
      <div 
        onClick={toggleOpen}
        style={{
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: isOpen ? 'var(--surface-hover)' : 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Círculo Rojo para Pendientes */}
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: isPending ? 'var(--status-critical)' : getStatusColor(localStatus)
          }} title={isPending ? 'Pendiente por evaluar' : 'Evaluado'} />
          
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>
              A.{control.id} {control.title}
            </h4>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isSaving && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Guardando...</span>}
          {!isSaving && !isPending && (
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: getStatusColor(localStatus) }}>
              {localStatus}
            </span>
          )}
          {isOpen ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
        </div>
      </div>

      {/* Contenido (Detalle y Evaluación) */}
      {isOpen && (
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
          <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {control.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Opciones de Evaluación */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Evaluación</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Cumple', 'No cumple', 'N/A'].map(statusOption => (
                  <button
                    key={statusOption}
                    onClick={() => {
                      setLocalStatus(statusOption);
                      if (statusOption === 'No cumple' && onTriggerFinding) {
                        onTriggerFinding({ ...control, observations: localObservations });
                      }
                      if (statusOption === 'Cumple' || statusOption === 'N/A') {
                        setIsOpen(false);
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${localStatus === statusOption ? getStatusColor(statusOption) : 'var(--border-light)'}`,
                      backgroundColor: localStatus === statusOption ? `${getStatusColor(statusOption)}1A` : 'transparent',
                      color: localStatus === statusOption ? getStatusColor(statusOption) : 'var(--text-primary)',
                      fontWeight: localStatus === statusOption ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>Observaciones</label>
              <textarea
                value={localObservations}
                onChange={(e) => setLocalObservations(e.target.value)}
                placeholder="Indique la evidencia o el motivo del incumplimiento..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '1rem',
                  borderRadius: 'var(--radius-button)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--surface-light)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Botón Preventivo de Hallazgo (Si aplica) */}
            {(localStatus === 'No cumple') && (
              <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: 'var(--surface-light)', borderRadius: 'var(--radius-button)', borderLeft: '4px solid var(--status-critical)' }}>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
                  <strong>¡Atención!</strong> Este control ha sido marcado con desviación. Deberá documentarse un hallazgo estructurado para el Informe Preliminar.
                </p>
                <Button variant="danger" size="sm" onClick={() => onTriggerFinding && onTriggerFinding({ ...control, observations: localObservations })}>
                  Registrar Hallazgo (CCCE)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
