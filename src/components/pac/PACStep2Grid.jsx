import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle } from 'lucide-react';

const RecommendationActionCard = ({ rec, index, existingAction, onSaveAction }) => {
  const [formData, setFormData] = useState({
    correctiveAction: existingAction?.correctiveAction || '',
    verificationMethod: existingAction?.verificationMethod || '',
    responsible: existingAction?.responsible || '',
    estimatedDate: existingAction?.estimatedDate || '',
    observations: existingAction?.observations || ''
  });

  useEffect(() => {
    if (existingAction) {
      setFormData({
        correctiveAction: existingAction.correctiveAction || '',
        verificationMethod: existingAction.verificationMethod || '',
        responsible: existingAction.responsible || '',
        estimatedDate: existingAction.estimatedDate || '',
        observations: existingAction.observations || ''
      });
    }
  }, [existingAction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSaveAction({
      recommendationId: rec.id,
      ...formData
    });
  };

  const isComplete = formData.correctiveAction.trim() !== '' && formData.verificationMethod.trim() !== '' && formData.responsible.trim() !== '' && formData.estimatedDate.trim() !== '';

  return (
    <Card style={{ padding: '2rem', marginBottom: '1.5rem', border: isComplete ? '1px solid var(--status-success)' : '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Badge status={isComplete ? 'closed' : 'in-progress'}>
          RECOMENDACIÓN NRO. {index + 1}
        </Badge>
        {isComplete && (
          <span style={{ color: 'var(--status-success)', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={16} /> Acción Registrada
          </span>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--surface-light)', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem', borderLeft: '4px solid var(--brand-accent)' }}>
        <div style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '500' }}>
          {rec.description}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Acción Correctiva *</label>
          <textarea 
            name="correctiveAction"
            value={formData.correctiveAction}
            onChange={handleChange}
            onBlur={handleSave}
            placeholder="Describa la acción correctiva a ejecutar por el organismo..."
            style={{ width: '100%', minHeight: '80px', padding: '0.75rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border-light)', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Medio de Verificación *</label>
            <Input 
              name="verificationMethod"
              value={formData.verificationMethod}
              onChange={handleChange}
              onBlur={handleSave}
              placeholder="Detalle actividades, documentos o soportes"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Responsable *</label>
            <Input 
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              onBlur={handleSave}
              placeholder="Indique apellidos, nombres y cargo"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tiempo Estimado *</label>
            <Input 
              type="date"
              name="estimatedDate"
              value={formData.estimatedDate}
              onChange={handleChange}
              onBlur={handleSave}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Lapso proyectado para ejecución.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Observaciones (Opcional)</label>
            <textarea 
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              onBlur={handleSave}
              placeholder="Señale cualquier información adicional relevante."
              style={{ width: '100%', minHeight: '60px', padding: '0.75rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border-light)', fontFamily: 'inherit' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
        <Button variant="primary" onClick={handleSave}>Guardar Acción</Button>
      </div>
    </Card>
  );
};

export const PACStep2Grid = ({ recommendations, actions, elaborator, onSaveAction, onSaveElaborator }) => {
  const [elabForm, setElabForm] = useState({
    name: elaborator?.name || '',
    cedula: elaborator?.cedula || '',
    role: elaborator?.role || ''
  });

  useEffect(() => {
    if (elaborator) {
      setElabForm({
        name: elaborator.name || '',
        cedula: elaborator.cedula || '',
        role: elaborator.role || ''
      });
    }
  }, [elaborator]);

  const handleElabChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...elabForm, [name]: value };
    setElabForm(nextForm);
    if (onSaveElaborator) {
      onSaveElaborator(nextForm);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        No hay recomendaciones disponibles en el Informe Definitivo para registrar acciones correctivas.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
      <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        A continuación, registre el Plan de Acciones Correctivas (PAC) para cada una de las recomendaciones emitidas en el Informe Definitivo:
      </div>
      
      {recommendations.map((rec, index) => {
        const existingAction = actions.find(a => a.recommendationId === rec.id);
        return (
          <RecommendationActionCard 
            key={rec.id || index}
            rec={rec}
            index={index}
            existingAction={existingAction}
            onSaveAction={onSaveAction}
          />
        );
      })}

      {/* Sección Elaborado por (Institución Auditada) */}
      <Card style={{ padding: '2rem', marginTop: '1rem', marginBottom: '2rem', border: (elabForm.name && elabForm.cedula && elabForm.role) ? '1px solid var(--status-success)' : '2px dashed var(--brand-accent)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--brand-primary)' }}>Elaborado por (Institución Auditada)</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Indique los datos del funcionario del ente evaluado responsable de elaborar y suscribir el presente Plan de Acciones Correctivas:
            </div>
          </div>
          {(elabForm.name && elabForm.cedula && elabForm.role) && (
            <span style={{ color: 'var(--status-success)', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} /> Datos Completos
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Apellidos y Nombres *</label>
            <Input 
              name="name"
              value={elabForm.name}
              onChange={handleElabChange}
              placeholder="Ej. Lic. José Ramírez"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Cédula de Identidad *</label>
            <Input 
              name="cedula"
              value={elabForm.cedula}
              onChange={handleElabChange}
              placeholder="Ej. V-15.432.109"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Cargo en la Institución *</label>
            <Input 
              name="role"
              value={elabForm.role}
              onChange={handleElabChange}
              placeholder="Ej. Director de Finanzas"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
