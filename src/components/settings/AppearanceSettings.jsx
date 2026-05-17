import React from 'react';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Palette, Save, Sun, Moon } from 'lucide-react';

export const AppearanceSettings = ({ config, onSave, saving }) => {
  const [formData, setFormData] = React.useState({
    theme: 'light',
    timezone: 'America/Caracas',
    dateFormat: 'DD/MM/YYYY',
    language: 'es'
  });

  React.useEffect(() => {
    if (!config) return;
    setFormData({ ...config });
  }, [config]);

  const handleThemeToggle = (isDark) => {
    const newTheme = isDark ? 'dark' : 'light';
    setFormData((prev) => ({ ...prev, theme: newTheme }));
    // Aplicar inmediatamente para feedback visual
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const timezoneOptions = [
    { value: 'America/Caracas', label: 'Venezuela (UTC-4:00)' },
    { value: 'America/Bogota', label: 'Colombia (UTC-5:00)' },
    { value: 'America/New_York', label: 'Este EEUU (UTC-5:00)' },
    { value: 'America/Mexico_City', label: 'México (UTC-6:00)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (UTC-3:00)' },
    { value: 'America/Santiago', label: 'Chile (UTC-4:00)' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (17/05/2026)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (05/17/2026)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-05-17)' }
  ];

  const languageOptions = [
    { value: 'es', label: 'Español' }
  ];

  const isDark = formData.theme === 'dark';

  return (
    <form onSubmit={handleSubmit}>
      {/* Theme */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            backgroundColor: 'var(--brand-accent)',
            color: 'white', width: '36px', height: '36px', borderRadius: 'var(--radius-button)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Palette size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Tema de la Interfaz</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Personaliza la apariencia visual del sistema
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {/* Light preview */}
          <div
            onClick={() => handleThemeToggle(false)}
            style={{
              flex: 1, padding: '1.25rem', borderRadius: 'var(--radius-card)',
              border: !isDark ? '2px solid var(--brand-accent)' : '2px solid var(--border-light)',
              cursor: 'pointer', backgroundColor: '#F8F9FA', transition: 'border-color 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Sun size={18} color="#F5A623" />
              <span style={{ fontWeight: 600, color: '#1E293B' }}>Claro</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', width: '60%' }} />
          </div>

          {/* Dark preview */}
          <div
            onClick={() => handleThemeToggle(true)}
            style={{
              flex: 1, padding: '1.25rem', borderRadius: 'var(--radius-card)',
              border: isDark ? '2px solid var(--brand-accent)' : '2px solid var(--border-light)',
              cursor: 'pointer', backgroundColor: '#1E293B', transition: 'border-color 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Moon size={18} color="#60A5FA" />
              <span style={{ fontWeight: 600, color: '#F8FAFC' }}>Oscuro</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#334155', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ height: '8px', backgroundColor: '#334155', borderRadius: '4px', width: '60%' }} />
          </div>
        </div>
      </Card>

      {/* Regional */}
      <Card>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>Configuración Regional</h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Zona horaria, formato de fecha e idioma del sistema
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
          <Select
            label="Zona Horaria"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            options={timezoneOptions}
          />
          <Select
            label="Formato de Fecha"
            name="dateFormat"
            value={formData.dateFormat}
            onChange={handleChange}
            options={dateFormatOptions}
          />
          <Select
            label="Idioma"
            name="language"
            value={formData.language}
            onChange={handleChange}
            options={languageOptions}
          />
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <Button variant="primary" type="submit" disabled={saving} style={{ gap: '8px' }}>
          <Save size={16} />
          {saving ? 'Guardando...' : 'Guardar Preferencias'}
        </Button>
      </div>
    </form>
  );
};
