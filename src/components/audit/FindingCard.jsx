import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const FindingCard = ({ finding }) => {
  const getSeverityStatus = (severity) => {
    switch(severity) {
      case 'Crítico': return 'critical';
      case 'Alto': return 'review'; // Usamos amarillo/naranja
      case 'Medio': return 'progress'; // Usamos azul
      case 'Bajo': return 'open'; // Usamos gris
      default: return 'default';
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
          {finding.id}
        </span>
        <Badge status={getSeverityStatus(finding.severity)}>{finding.severity}</Badge>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
          Control Vulnerado: {finding.criterion.substring(0, 40)}...
        </h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          <strong>Condición:</strong> {finding.condition}
        </p>
      </div>
      
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Auditoría: {finding.auditId}</span>
        <Badge status={finding.status === 'Abierto' ? 'review' : 'closed'}>{finding.status}</Badge>
      </div>
    </Card>
  );
};
