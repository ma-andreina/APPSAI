import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { useAppContext } from '../../context/AppContext';
import { Database, Download, Upload, HardDrive, CheckCircle, XCircle } from 'lucide-react';

export const BackupSettings = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { addNotification } = useAppContext();

  useEffect(() => { loadHealth(); }, []);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSystemHealth();
      setHealth(data);
    } catch (error) {
      addNotification('Error al cargar estado del sistema', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await settingsService.exportData();
      addNotification(result.message, 'success');
    } catch (error) {
      addNotification('Error al exportar datos', 'error');
    } finally {
      setExporting(false);
    }
  };

  const formatBackupDate = (isoString) => {
    if (!isoString) return 'No disponible';
    return new Date(isoString).toLocaleString('es-VE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Skeleton height="120px" borderRadius="var(--radius-card)" />
        <Skeleton height="180px" borderRadius="var(--radius-card)" />
        <Skeleton height="100px" borderRadius="var(--radius-card)" />
      </div>
    );
  }

  const isConnected = health?.firebaseStatus === 'connected';
  const stats = health?.stats || {};

  return (
    <div>


      {/* System Stats */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HardDrive size={18} color="var(--text-secondary)" />
          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Estadísticas del Sistema</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Usuarios', value: stats.totalUsers, color: 'var(--brand-accent)' },
            { label: 'Auditorías', value: stats.totalAudits, color: 'var(--status-progress)' },
            { label: 'Hallazgos', value: stats.totalFindings, color: 'var(--status-review)' },
            { label: 'Informes', value: stats.totalReports, color: 'var(--status-closed)' },
            { label: 'PAC', value: stats.totalPACs, color: 'var(--status-critical)' },
            { label: 'Registros Log', value: stats.totalLogs, color: 'var(--text-secondary)' }
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '1rem', backgroundColor: 'var(--surface-light)',
              borderRadius: 'var(--radius-button)', textAlign: 'center',
              borderTop: `3px solid ${stat.color}`
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value || 0}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Export / Import */}
      <Card>
        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>Respaldos Manuales</h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Exporta o importa la data completa del sistema en formato JSON
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="primary" onClick={handleExport} disabled={exporting} style={{ gap: '8px' }}>
            <Download size={16} />
            {exporting ? 'Exportando...' : 'Exportar Datos (JSON)'}
          </Button>
          <Button variant="outline" disabled style={{ gap: '8px', opacity: 0.5 }}>
            <Upload size={16} />
            Importar Datos (Fase 2)
          </Button>
        </div>
      </Card>
    </div>
  );
};
