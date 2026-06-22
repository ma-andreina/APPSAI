import React from 'react';
import { Card } from '../ui/Card';

export const Step1GeneralData = ({ data, updateData, errors = [] }) => {
  // Calcular fecha máxima permitida (ayer)
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const maxDate = today.toISOString().split('T')[0];

  const handleChange = (e) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    if (!value) {
      updateData({ ...data, [name]: value });
      return;
    }

    // Validar que sea anterior a hoy
    if (value > maxDate) {
      alert('La fecha seleccionada debe ser anterior al día de hoy.');
      return;
    }

    // Validar orden cronológico y que no sean iguales
    if (name === 'alcanceDesde' && data.alcanceHasta) {
      if (value === data.alcanceHasta) {
        alert('Las fechas de alcance no pueden ser iguales.');
        return;
      }
      if (value > data.alcanceHasta) {
        alert('La fecha "Desde" no puede ser posterior a la fecha "Hasta".');
        return;
      }
    }

    if (name === 'alcanceHasta' && data.alcanceDesde) {
      if (value === data.alcanceDesde) {
        alert('Las fechas de alcance no pueden ser iguales.');
        return;
      }
      if (value < data.alcanceDesde) {
        alert('La fecha "Hasta" no puede ser anterior a la fecha "Desde".');
        return;
      }
    }

    updateData({ ...data, [name]: value });
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

  const getLabelStyle = (fieldName) => ({
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: errors.includes(fieldName) ? 'red' : 'var(--text-primary)',
    transition: 'color 0.3s'
  });

  return (
    <Card style={{ padding: '2rem' }}>
      <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem' }}>Datos de la Auditoría (Identificación)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div>
          <label style={getLabelStyle('codigo')}>ID de Auditoría (Código)</label>
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
          <label style={getLabelStyle('institucion')}>Institución / Ente a Auditar</label>
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
          <label style={getLabelStyle('alcanceDesde')}>Alcance (Desde)</label>
          <input 
            type="date" 
            name="alcanceDesde" 
            value={data.alcanceDesde || ''} 
            onChange={handleDateChange} 
            max={data.alcanceHasta ? data.alcanceHasta : maxDate}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={getLabelStyle('alcanceHasta')}>Alcance (Hasta)</label>
          <input 
            type="date" 
            name="alcanceHasta" 
            value={data.alcanceHasta || ''} 
            onChange={handleDateChange} 
            min={data.alcanceDesde || ''}
            max={maxDate}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label style={getLabelStyle('tipo')}>Tipo de Auditoría</label>
        <input 
          type="text" 
          value="Seguridad de la Información" 
          disabled
          style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={getLabelStyle('origenActuacion')}>Origen de la Actuación</label>
        <textarea 
          name="origenActuacion" 
          value={data.origenActuacion || ''} 
          onChange={handleChange} 
          placeholder="Origen de la actuación..."
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={getLabelStyle('objetivo')}>Objetivo General</label>
        <textarea 
          name="objetivo" 
          value={data.objetivo} 
          onChange={handleChange} 
          placeholder="Finalidad o propósito que persigue la Contraloría para realizar la auditoría..."
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
          required
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={getLabelStyle('objetivosEspecificos')}>Objetivos Específicos</label>
        <textarea 
          name="objetivosEspecificos" 
          value={data.objetivosEspecificos || ''} 
          onChange={handleChange} 
          placeholder="Objetivos específicos de la auditoría..."
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={getLabelStyle('enfoque')}>Enfoque</label>
        <textarea 
          name="enfoque" 
          value={data.enfoque || ''} 
          onChange={handleChange} 
          placeholder="Enfoque de la auditoría..."
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={getLabelStyle('metodosProcedimientosTecnicas')}>Métodos, Procedimientos y Técnicas</label>
        <textarea 
          name="metodosProcedimientosTecnicas" 
          value={data.metodosProcedimientosTecnicas || ''} 
          onChange={handleChange} 
          placeholder="Métodos, procedimientos y técnicas a aplicar..."
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={getLabelStyle('caracteristicasInstitucion')}>Características de la Institución Evaluada</label>
        <textarea 
          name="caracteristicasInstitucion" 
          value={data.caracteristicasInstitucion || ''} 
          onChange={handleChange} 
          placeholder="Características relevantes de la institución..."
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={getLabelStyle('baseLegalTecnica')}>Base Legal y Técnica</label>
        <textarea 
          name="baseLegalTecnica" 
          value={data.baseLegalTecnica || ''} 
          onChange={handleChange} 
          placeholder="Normativa legal y técnica aplicable..."
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div>
          <label style={getLabelStyle('oficioNro')}>Oficio Nro.</label>
          <input type="text" name="oficioNro" value={data.oficioNro} onChange={handleChange} placeholder="Ej. 142-2026" style={inputStyle} />
        </div>
        <div>
          <label style={getLabelStyle('destinatarioNombre')}>Destinatario del Oficio (Nombre)</label>
          <input type="text" name="destinatarioNombre" value={data.destinatarioNombre} onChange={handleChange} placeholder="Ej. Ing. María González" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={getLabelStyle('destinatarioCargo')}>Cargo del Destinatario</label>
          <input type="text" name="destinatarioCargo" value={data.destinatarioCargo} onChange={handleChange} placeholder="Ej. Directora de Tecnología" style={inputStyle} />
        </div>
        <div>
          <label style={getLabelStyle('destinatarioDireccion')}>Dirección</label>
          <input type="text" name="destinatarioDireccion" value={data.destinatarioDireccion} onChange={handleChange} placeholder="Ej. Alcaldía del Municipio Pedraza, Ciudad Bolivia, Edo. Barinas" style={inputStyle} />
        </div>
      </div>
    </Card>
  );
};
