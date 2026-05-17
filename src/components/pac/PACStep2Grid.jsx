import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CheckCircle } from 'lucide-react';

export const PACStep2Grid = ({ recommendations, actions, onSaveAction }) => {
  const [selectedRecId, setSelectedRecId] = useState(recommendations[0]?.id || null);
  
  // Estado local del formulario para la recomendación seleccionada
  const [formData, setFormData] = useState({
    correctiveAction: '',
    verificationMethod: '',
    responsible: '',
    estimatedDate: '',
    observations: ''
  });

  // Al cambiar la recomendación seleccionada, carga sus datos si ya existen
  useEffect(() => {
    if (selectedRecId) {
      const existingAction = actions.find(a => a.recommendationId === selectedRecId);
      if (existingAction) {
        setFormData({
          correctiveAction: existingAction.correctiveAction || '',
          verificationMethod: existingAction.verificationMethod || '',
          responsible: existingAction.responsible || '',
          estimatedDate: existingAction.estimatedDate || '',
          observations: existingAction.observations || ''
        });
      } else {
        setFormData({ correctiveAction: '', verificationMethod: '', responsible: '', estimatedDate: '', observations: '' });
      }
    }
  }, [selectedRecId, actions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSaveAction({
      recommendationId: selectedRecId,
      ...formData
    });
  };

  const selectedRec = recommendations.find(r => r.id === selectedRecId);

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%', alignItems: 'stretch' }}>
      
      {/* Sidebar de Recomendaciones */}
      <div style={{ width: '30%', borderRight: '1px solid var(--border-light)', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Recomendaciones</h4>
        {recommendations.map(rec => {
          const isCompleted = actions.some(a => a.recommendationId === rec.id && a.correctiveAction.trim() !== '');
          const isActive = selectedRecId === rec.id;
          
          return (
            <div 
              key={rec.id}
              onClick={() => setSelectedRecId(rec.id)}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-button)',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--surface-light)',
                color: isActive ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                border: isActive ? 'none' : '1px solid transparent'
              }}
            >
              <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{rec.title}</span>
              {isCompleted && <CheckCircle size={16} color={isActive ? 'white' : 'var(--status-success)'} />}
            </div>
          );
        })}
      </div>

      {/* Formulario de Acción */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {selectedRec ? (
          <Card style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: 'var(--surface-light)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', borderLeft: '4px solid var(--brand-accent)' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--brand-primary)' }}>{selectedRec.title}</div>
              <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{selectedRec.description}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Acción Correctiva *</label>
                <textarea 
                  name="correctiveAction"
                  value={formData.correctiveAction}
                  onChange={handleInputChange}
                  placeholder="Describa la acción a ejecutar..."
                  style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border-light)', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input 
                  label="Medio de Verificación *" 
                  name="verificationMethod"
                  value={formData.verificationMethod}
                  onChange={handleInputChange}
                  placeholder="Detalle las actividades a desarrollar para erradicar, disminuir o prevenir..."
                />
                <Input 
                  label="Responsable *" 
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleInputChange}
                  placeholder="Indique apellidos, nombres y cargo del funcionario"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input 
                  label="Tiempo Estimado *" 
                  name="estimatedDate"
                  type="date"
                  value={formData.estimatedDate}
                  onChange={handleInputChange}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'flex-end', paddingBottom: '1rem' }}>
                  Es el lapso proyectado para la ejecución de las acciones correctivas o preventivas.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Observaciones (Opcional)</label>
                <textarea 
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  placeholder="Señale cualquier información adicional que considere relevante."
                  style={{ width: '100%', minHeight: '60px', padding: '0.75rem', borderRadius: 'var(--radius-input)', border: '1px solid var(--border-light)', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <Button variant="primary" onClick={handleSave}>Guardar Acción (Borrador)</Button>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            Selecciona una recomendación a la izquierda
          </div>
        )}
      </div>

    </div>
  );
};
