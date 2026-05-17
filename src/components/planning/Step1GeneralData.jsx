import React from 'react';
import { Card } from '../ui/Card';

export const Step1GeneralData = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-button)',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--surface-light)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: 'var(--text-primary)'
  };

  return (
    <Card style={{ padding: '2rem' }}>
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Datos de la Auditoría (Identificación)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>ID de Auditoría (Código)</label>
          <input 
            type="text" 
            name="codigo" 
            value={data.codigo} 
            onChange={handleChange} 
            placeholder="Ej. AUD-2026-001"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Institución / Ente a Auditar</label>
          <input 
            type="text" 
            name="institucion" 
            value={data.institucion} 
            onChange={handleChange} 
            placeholder="Nombre de la Institución Auditada"
            style={inputStyle}
            required
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Alcance (Desde)</label>
          <input 
            type="date" 
            name="alcanceDesde" 
            value={data.alcanceDesde} 
            onChange={handleChange} 
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Alcance (Hasta)</label>
          <input 
            type="date" 
            name="alcanceHasta" 
            value={data.alcanceHasta} 
            onChange={handleChange} 
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label style={labelStyle}>Tipo de Auditoría</label>
        <input 
          type="text" 
          value="Seguridad de la Información" 
          disabled
          style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={labelStyle}>Objetivo General</label>
        <textarea 
          name="objetivo" 
          value={data.objetivo} 
          onChange={handleChange} 
          placeholder="Finalidad o propósito que persigue la Contraloría para realizar la auditoría..."
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
          required
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div>
          <label style={labelStyle}>Oficio Nro.</label>
          <input type="text" name="oficioNro" value={data.oficioNro} onChange={handleChange} placeholder="Ej. 142-2026" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Destinatario del Oficio (Nombre)</label>
          <input type="text" name="destinatarioNombre" value={data.destinatarioNombre} onChange={handleChange} placeholder="Ej. Ing. María González" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={labelStyle}>Cargo del Destinatario</label>
          <input type="text" name="destinatarioCargo" value={data.destinatarioCargo} onChange={handleChange} placeholder="Ej. Directora de Tecnología" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Dirección</label>
          <input type="text" name="destinatarioDireccion" value={data.destinatarioDireccion} onChange={handleChange} placeholder="Ej. Alcaldía del Municipio Pedraza, Ciudad Bolivia, Edo. Barinas" style={inputStyle} />
        </div>
      </div>
    </Card>
  );
};
