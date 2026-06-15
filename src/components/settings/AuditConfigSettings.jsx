import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toggle } from '../ui/Toggle';
import { Badge } from '../ui/Badge';
import { ClipboardCheck, Save } from 'lucide-react';

export const AuditConfigSettings = ({ config, onSave, saving }) => {
  const [formData, setFormData] = React.useState({
    defaultPACDeadlineDays: 30,
    reportSignatureDeadlineDays: 15,
    alertAdvanceDays: 5,
    requireDigitalSignature: true,
    isoScales: [],
    checklistCategories: []
  });

  React.useEffect(() => {
    if (!config) return;
    setFormData({ ...config });
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Days') ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleToggleSignature = (checked) => {
    setFormData((prev) => ({ ...prev, requireDigitalSignature: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Plazos y Tiempos */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            backgroundColor: 'var(--status-progress)',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ClipboardCheck size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Plazos y Tiempos</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Define los plazos por defecto para procesos de auditoría
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
          <Input
            label="Plazo PAC (días)"
            name="defaultPACDeadlineDays"
            type="number"
            value={formData.defaultPACDeadlineDays}
            onChange={handleChange}
          />
          <Input
            label="Plazo Firma de Informes (días)"
            name="reportSignatureDeadlineDays"
            type="number"
            value={formData.reportSignatureDeadlineDays}
            onChange={handleChange}
          />
          <Input
            label="Anticipación para Alertas (días)"
            name="alertAdvanceDays"
            type="number"
            value={formData.alertAdvanceDays}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <Toggle
            label="Firma Digital Obligatoria"
            description="Cuando está activado, todos los informes y documentos oficiales requieren firma digital para su validez legal según la Ley sobre Mensajes de Datos y Firmas Electrónicas."
            checked={formData.requireDigitalSignature}
            onChange={handleToggleSignature}
          />
        </div>
      </Card>

      {/* Escalas ISO 27001 */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>Escalas de Calificación ISO 27001:2022</h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Valores utilizados en el checklist de ejecución de auditoría
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {formData.isoScales.map((scale) => (
            <div
              key={scale.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--surface-light)',
                borderRadius: 'var(--radius-button)',
                borderLeft: `4px solid ${scale.color}`
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: scale.color,
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{scale.key}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                  — {scale.label}
                </span>
              </div>
              <Badge status={scale.key === 'Cumple' ? 'closed' : (scale.key === 'N/A' ? 'default' : 'critical')}>
                {scale.key}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Categorías del Checklist */}
      <Card>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>Categorías del Checklist</h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Grupos de controles según el Anexo A de la ISO 27001:2022
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {formData.checklistCategories.map((category, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--surface-light)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-accent)',
                flexShrink: 0
              }} />
              {category}
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <Button variant="primary" type="submit" disabled={saving} style={{ gap: '8px' }}>
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
};
