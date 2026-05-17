import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { UploadCloud } from 'lucide-react';

export const FindingForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    condition: '',
    criterion: '',
    cause: '',
    effect: '',
    severity: 'Medio',
    ...initialData
  });
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  // Si initialData cambia (ej: se abre modal con otro control), actualizamos el form
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => file.name);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, evidence: files });
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-primary)'
  };

  const inputStyle = {
    width: '100%',
    minHeight: '80px',
    padding: '0.75rem',
    borderRadius: 'var(--radius-button)',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--surface-light)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    resize: 'vertical'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Condición */}
      <div style={fieldStyle}>
        <label style={labelStyle}>1. Condición</label>
        <textarea 
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          required
          style={inputStyle} 
          placeholder="¿Qué fue lo que encontraste exactamente? Describe la realidad observada en la auditoría..." 
        />
      </div>

      {/* Criterio */}
      <div style={fieldStyle}>
        <label style={labelStyle}>2. Criterio</label>
        <textarea 
          name="criterion"
          value={formData.criterion}
          onChange={handleChange}
          required
          style={inputStyle} 
          placeholder="¿Qué dice la norma ISO 27001 o el procedimiento que debería pasar?" 
        />
      </div>

      {/* Causa */}
      <div style={fieldStyle}>
        <label style={labelStyle}>3. Causa</label>
        <textarea 
          name="cause"
          value={formData.cause}
          onChange={handleChange}
          required
          style={inputStyle} 
          placeholder="¿Por qué sucedió? (Ej: Falta de presupuesto, desconocimiento de la norma, omisión humana...)" 
        />
      </div>

      {/* Efecto */}
      <div style={fieldStyle}>
        <label style={labelStyle}>4. Efecto (Riesgo)</label>
        <textarea 
          name="effect"
          value={formData.effect}
          onChange={handleChange}
          required
          style={inputStyle} 
          placeholder="¿Cuál es el riesgo o impacto para la organización y sus activos de información?" 
        />
      </div>

      {/* Severidad */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Clasificación de Severidad</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Crítico', 'Alto', 'Medio', 'Bajo'].map(level => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData({ ...formData, severity: level })}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${formData.severity === level ? 'var(--brand-accent)' : 'var(--border-light)'}`,
                backgroundColor: formData.severity === level ? 'var(--brand-accent)' : 'transparent',
                color: formData.severity === level ? 'white' : 'var(--text-primary)',
                fontWeight: formData.severity === level ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Evidencias (Drag & Drop) */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Evidencias Respaldo</label>
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--brand-accent)' : 'var(--border-light)'}`,
            borderRadius: 'var(--radius-card)',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: isDragging ? 'var(--surface-hover)' : 'transparent',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
        >
          <UploadCloud size={40} color={isDragging ? 'var(--brand-accent)' : 'var(--text-secondary)'} style={{ marginBottom: '1rem' }} />
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Arrastra y suelta tus archivos aquí</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PDF, JPG, PNG (Max 10MB)</p>
          
          {files.length > 0 && (
            <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              <strong style={{ fontSize: '0.85rem' }}>Archivos adjuntos:</strong>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--brand-accent)' }}>
                {files.map((file, idx) => <li key={idx}>{file}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '1.5rem', 
        paddingBottom: '1.5rem', 
        borderTop: '1px solid var(--border-light)', 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '1rem' 
      }}>
        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" type="submit">Guardar Hallazgo</Button>
      </div>

    </form>
  );
};
