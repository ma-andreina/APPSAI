import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { InstitutionalSettings } from '../components/settings/InstitutionalSettings';
import { AuditConfigSettings } from '../components/settings/AuditConfigSettings';
import { AuditLogViewer } from '../components/settings/AuditLogViewer';
import { BackupSettings } from '../components/settings/BackupSettings';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { Settings as SettingsIcon, ShieldAlert, Building2, ClipboardCheck, Shield, Database, Palette } from 'lucide-react';

const SETTINGS_TABS = [
  { id: 'institutional', label: 'Institución', icon: <Building2 size={16} /> },
  { id: 'audit', label: 'Auditorías', icon: <ClipboardCheck size={16} /> },
  { id: 'logs', label: 'Bitácora', icon: <Shield size={16} /> },
  { id: 'backup', label: 'Respaldos', icon: <Database size={16} /> },
  { id: 'appearance', label: 'Apariencia', icon: <Palette size={16} /> }
];

export const Settings = () => {
  const { isAdmin } = useAuth();
  const { addNotification } = useAppContext();
  const [activeTab, setActiveTab] = useState('institutional');
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSystemConfig();
      setConfig(data);
    } catch (error) {
      addNotification('Error al cargar la configuración', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInstitutional = async (data) => {
    setSaving(true);
    try {
      const updated = await settingsService.updateInstitutionalParams(data);
      setConfig((prev) => ({ ...prev, institutional: updated }));
      addNotification('Datos institucionales guardados correctamente', 'success');
    } catch (error) {
      addNotification('Error al guardar datos institucionales', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAuditConfig = async (data) => {
    setSaving(true);
    try {
      const updated = await settingsService.updateAuditConfig(data);
      setConfig((prev) => ({ ...prev, audit: updated }));
      addNotification('Configuración de auditorías guardada correctamente', 'success');
    } catch (error) {
      addNotification('Error al guardar configuración de auditorías', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async (data) => {
    setSaving(true);
    try {
      const updated = await settingsService.updateAppearance(data);
      setConfig((prev) => ({ ...prev, appearance: updated }));
      addNotification('Preferencias de apariencia guardadas', 'success');
    } catch (error) {
      addNotification('Error al guardar preferencias', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Acceso restringido para no-admins
  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Card style={{ textAlign: 'center', maxWidth: '420px', padding: '3rem' }}>
          <ShieldAlert size={48} color="var(--status-critical)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Acceso Restringido</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Solo los usuarios con rol de <strong>Contralor Municipal</strong> o <strong>Director General</strong> pueden acceder al módulo de configuración del sistema.
          </p>
        </Card>
      </div>
    );
  }

  const renderTabContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Skeleton height="150px" borderRadius="var(--radius-card)" />
          <Skeleton height="200px" borderRadius="var(--radius-card)" />
          <Skeleton height="80px" borderRadius="var(--radius-card)" />
        </div>
      );
    }

    switch (activeTab) {
      case 'institutional':
        return <InstitutionalSettings config={config?.institutional} onSave={handleSaveInstitutional} saving={saving} />;
      case 'audit':
        return <AuditConfigSettings config={config?.audit} onSave={handleSaveAuditConfig} saving={saving} />;
      case 'logs':
        return <AuditLogViewer />;
      case 'backup':
        return <BackupSettings />;
      case 'appearance':
        return <AppearanceSettings config={config?.appearance} onSave={handleSaveAppearance} saving={saving} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          backgroundColor: 'var(--brand-primary)',
          color: 'white', padding: '10px', borderRadius: 'var(--radius-button)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>Configuración del Sistema</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Parámetros globales, bitácora de auditoría, respaldos y preferencias.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={SETTINGS_TABS.map((tab) => ({
          ...tab,
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {tab.icon} {tab.label}
            </span>
          )
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div style={{ flex: 1, paddingBottom: '2rem' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};
