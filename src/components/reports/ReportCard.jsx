import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FileText, CheckCircle, FileSignature, Download, Eye, Edit3 } from 'lucide-react';

export const ReportCard = ({ report, onPreview, onSign }) => {
  const getStatusIcon = (status) => {
    if (status === 'firmado') return <CheckCircle size={16} color="var(--status-closed)" />;
    if (status === 'generado') return <FileText size={16} color="var(--brand-accent)" />;
    return <FileText size={16} color="var(--text-secondary)" opacity={0.5} />;
  };

  const getStatusColor = (status) => {
    if (status === 'firmado') return 'closed'; // Green
    if (status === 'generado') return 'in-progress'; // Blue
    return 'default'; // Gray
  };

  const isFirmado = report.definitive.status === 'firmado';

  return (
    <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      
      {/* Encabezado */}
      <div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          {report.auditId}
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', lineHeight: '1.3' }}>
          {report.auditTitle}
        </h3>
        <div style={{ color: 'var(--brand-accent)', fontWeight: 500, fontSize: '0.9rem' }}>
          {report.entity}
        </div>
      </div>

      {/* Cuerpo: Indicadores de Documentos */}
      <div style={{ backgroundColor: 'var(--surface-light)', borderRadius: 'var(--radius-button)', padding: '1rem', flex: 1 }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Estado de Documentos
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              {getStatusIcon(report.preliminary.status)} Preliminar
            </span>
            <Badge status={getStatusColor(report.preliminary.status)}>
              {report.preliminary.status}
            </Badge>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              {getStatusIcon(report.definitive.status)} Definitivo
            </span>
            <Badge status={getStatusColor(report.definitive.status)}>
              {report.definitive.status}
            </Badge>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              {getStatusIcon(report.executive.status)} R. Ejecutivo
            </span>
            <Badge status={getStatusColor(report.executive.status)}>
              {report.executive.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Botón Principal de Redacción arriba de Firma Contralor */}
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <Button 
          variant="primary" 
          onClick={() => onPreview(report, 'definitivo_edit')} 
          style={{ width: '100%', marginBottom: '0.75rem', gap: '8px', fontWeight: 'bold', padding: '0.65rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Edit3 size={16} /> Redactar Inf. definitivo
        </Button>

        {/* Indicador de Firma */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem 0 0.75rem 0' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <FileSignature size={18} /> Firma Contralor:
          </span>
          <Badge status={isFirmado ? 'review' : 'default'} style={{ backgroundColor: isFirmado ? 'var(--status-review)' : 'var(--surface-hover)', color: isFirmado ? 'white' : 'var(--text-secondary)' }}>
            {isFirmado ? 'Firmado' : 'Pendiente'}
          </Badge>
        </div>
      </div>

      {/* Línea de botones de vistas preliminares abajo */}
      <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
        <Button variant="outline" size="sm" onClick={() => onPreview(report, 'preliminar')} style={{ flex: 1, padding: '0.45rem 4px', fontSize: '0.76rem', justifyContent: 'center' }} title="Vista preliminar: Informe Preliminar">
          <Eye size={13} style={{ marginRight: '4px' }} /> Preliminar
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPreview(report, 'definitivo')} style={{ flex: 1, padding: '0.45rem 4px', fontSize: '0.76rem', justifyContent: 'center' }} title="Vista preliminar: Informe Definitivo">
          <Eye size={13} style={{ marginRight: '4px' }} /> Definitivo
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPreview(report, 'ejecutivo')} style={{ flex: 1.25, padding: '0.45rem 4px', fontSize: '0.76rem', justifyContent: 'center' }} title="Vista preliminar: Resumen Ejecutivo">
          <Eye size={13} style={{ marginRight: '4px' }} /> Resumen Ejecutivo
        </Button>
      </div>

    </Card>
  );
};
