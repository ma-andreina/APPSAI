import React, { useState, useEffect } from 'react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { KanbanColumn } from '../components/kanban/KanbanColumn';
import { KanbanCard } from '../components/kanban/KanbanCard';
import { DonutChart } from '../components/ui/DonutChart';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { auditService } from '../services/auditService';
import { Plus } from 'lucide-react';

export const Dashboard = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditService.getAll().then(data => {
      setAudits(data);
      setLoading(false);
    });
  }, []);

  // Agrupar auditorías por estado
  const columns = {
    'open': { title: 'Planificación', status: 'open', items: [] },
    'in-progress': { title: 'En Ejecución', status: 'in-progress', items: [] },
    'review': { title: 'En Revisión', status: 'review', items: [] },
    'closed': { title: 'Completada', status: 'closed', items: [] }
  };

  audits.forEach(audit => {
    if (columns[audit.status]) {
      columns[audit.status].items.push(audit);
    }
  });

  // Estadísticas
  const totalAudits = audits.length;
  const completedAudits = audits.filter(a => a.status === 'closed').length;
  const inProgressAudits = audits.filter(a => a.status === 'in-progress' || a.status === 'review').length;
  
  // Calcular porcentaje promedio de avance de auditorías activas
  const activeAudits = audits.filter(a => a.status !== 'closed');
  const avgProgress = activeAudits.length > 0 
    ? Math.round(activeAudits.reduce((acc, curr) => acc + curr.progress, 0) / activeAudits.length) 
    : 0;

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando tablero...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* Zona Central: Kanban */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Proyectos de Auditoría</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Gestiona y supervisa las auditorías activas</p>
          </div>
          <Button variant="primary" style={{ gap: '8px' }}>
            <Plus size={18} />
            Crear Proyecto
          </Button>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <KanbanBoard>
            {Object.entries(columns).map(([key, col]) => (
              <KanbanColumn key={key} title={col.title} status={col.status} count={col.items.length}>
                {col.items.map(audit => (
                  <KanbanCard key={audit.id} audit={audit} />
                ))}
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </div>
      </div>

      {/* Panel Lateral: Estadísticas */}
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>
        
        {/* Card de Cumplimiento */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1.5rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', alignSelf: 'flex-start' }}>Avance Global (ISO 27001)</h3>
          <DonutChart percentage={avgProgress} color="var(--brand-accent)" />
          <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
            Promedio de implementación de controles en las instituciones auditadas.
          </p>
        </Card>

        {/* Card de Resumen de Proyectos */}
        <Card>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Resumen</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            <div style={{ backgroundColor: 'var(--surface-light)', padding: '1rem', borderRadius: 'var(--radius-button)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Total</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--brand-accent)', marginTop: '0.25rem' }}>
                {totalAudits}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-light)', padding: '1rem', borderRadius: 'var(--radius-button)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Completados</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-closed)', marginTop: '0.25rem' }}>
                {completedAudits}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-light)', padding: '1rem', borderRadius: 'var(--radius-button)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>En Curso</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-progress)', marginTop: '0.25rem' }}>
                {inProgressAudits}
              </div>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
};
