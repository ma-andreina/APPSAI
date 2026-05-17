import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const PACStep1Base = ({ baseData }) => {
  if (!baseData) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
      <div style={{ backgroundColor: 'var(--surface-light)', padding: '1.5rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--brand-primary)', borderBottom: '2px solid var(--border-light)', paddingBottom: '0.5rem' }}>
          Información del Informe Definitivo
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Código de Auditoría</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{baseData.auditId}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Estado del Informe Definitivo</div>
            <Badge status={baseData.reportStatus === 'firmado' ? 'closed' : 'in-progress'}>
              {baseData.reportStatus.toUpperCase()}
            </Badge>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Objeto Evaluado (Ente)</div>
            <div style={{ fontWeight: '500' }}>{baseData.organism}</div>
          </div>
        </div>
      </div>

      <Card style={{ padding: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Objetivo General</h4>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>{baseData.objetivoGeneral}</p>
      </Card>

      <Card style={{ padding: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Alcance</h4>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>{baseData.alcance}</p>
      </Card>
      
      <div style={{ backgroundColor: '#F0F9FF', color: 'var(--brand-accent)', padding: '1rem', borderRadius: 'var(--radius-button)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>ℹ️</span> Los datos mostrados en este paso son de solo lectura y provienen directamente del Informe Definitivo.
      </div>
    </div>
  );
};
