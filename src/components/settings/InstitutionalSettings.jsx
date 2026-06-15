import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Building2, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const InstitutionalSettings = ({ config, onSave, saving }) => {
  const { addNotification } = useAppContext();
  const [formData, setFormData] = React.useState({
    institutionName: '',
    address: '',
    phone: '',
    email: '',
    rif: '',
    fiscalYear: new Date().getFullYear(),
    maxAuthority: '',
    maxAuthorityRole: '',
    maxAuthorityAppointment: '',
    maxAuthorityGazette: ''
  });

  React.useEffect(() => {
    if (!config) return;
    setFormData({ ...config });
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Filtrar letras: permitir solo números, +, -, espacios
      const filtered = value.replace(/[^0-9+\-\s]/g, '');
      setFormData((prev) => ({ ...prev, [name]: filtered }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de correo electrónico obligatoria
    if (!formData.email || !formData.email.includes('@')) {
      addNotification('El correo electrónico institucional debe contener el carácter "@" obligatoriamente.', 'error');
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            backgroundColor: 'var(--brand-accent)',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Datos de la Institución</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Información oficial de la Contraloría Municipal
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              label="Nombre de la Institución"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              placeholder="Contraloría del Municipio..."
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección completa"
            />
          </div>
          <Input
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+58 273-XXXXXXX"
          />
          <Input
            label="Correo Institucional"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contraloria@cmp.gob.ve"
          />
          <Input
            label="RIF"
            name="rif"
            value={formData.rif}
            onChange={handleChange}
            placeholder="G-XXXXXXXX-X"
          />
          <Input
            label="Año Fiscal Vigente"
            name="fiscalYear"
            type="number"
            value={formData.fiscalYear}
            onChange={handleChange}
          />
        </div>
      </Card>

      <Card>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem' }}>Máxima Autoridad</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem' }}>
          <Input
            label="Nombre Completo"
            name="maxAuthority"
            value={formData.maxAuthority}
            onChange={handleChange}
            disabled
          />
          <Input
            label="Cargo"
            name="maxAuthorityRole"
            value={formData.maxAuthorityRole}
            onChange={handleChange}
            disabled
          />
          <Input
            label="Acta / Resolución de Nombramiento (Nro. y fecha)"
            name="maxAuthorityAppointment"
            value={formData.maxAuthorityAppointment || ''}
            onChange={handleChange}
            placeholder="Ej: Resolución Nro. XXX-XX de fecha XX/XX/XXXX"
          />
          <Input
            label="Publicación en Gaceta (Nro. y fecha)"
            name="maxAuthorityGazette"
            value={formData.maxAuthorityGazette || ''}
            onChange={handleChange}
            placeholder="Ej: Gaceta Municipal Nro. XXX de fecha XX/XX/XXXX"
          />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.75rem 0 0 0', fontStyle: 'italic' }}>
          Los campos de Nombre y Cargo se vinculan automáticamente al usuario con rol de Contralor Municipal registrado en el sistema.
        </p>
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
