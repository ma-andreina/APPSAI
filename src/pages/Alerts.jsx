import React, { useState, useEffect } from 'react';
import { alertService } from '../services/alertService';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Bell, Clock, AlertTriangle, XCircle, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (error) {
      addNotification('Error al cargar las alertas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async (alertId) => {
    try {
      const result = await alertService.escalateAlert(alertId);
      // Actualizamos el estado local para marcarlo como escalado visualmente
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, escalated: true } : a));
      addNotification(result.message, 'success');
    } catch (error) {
      addNotification('Error al escalar la alerta', 'error');
    }
  };

  const handleNavigate = (type) => {
    if (type === 'PAC') navigate('/pac');
    else if (type === 'Informe') navigate('/reports');
  };

  // Filtrado de columnas
  const onTimeAlerts = alerts.filter(a => a.status === 'a-tiempo');
  const nearingAlerts = alerts.filter(a => a.status === 'proximo');
  const overdueAlerts = alerts.filter(a => a.status === 'vencido');

  const KanbanColumn = ({ title, icon, alerts, colorHex, emptyMsg }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-card)', padding: '1rem', minWidth: '320px', height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: `2px solid ${colorHex}`, paddingBottom: '0.5rem' }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title} ({alerts.length})</h3>
      </div>
      
      {loading ? (
        <>
          <Skeleton height="120px" borderRadius="var(--radius-card)" style={{ marginBottom: '1rem' }} />
          <Skeleton height="120px" borderRadius="var(--radius-card)" />
        </>
      ) : alerts.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0', fontStyle: 'italic' }}>
          {emptyMsg}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} onEscalate={handleEscalate} onNavigate={handleNavigate} colorHex={colorHex} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: 'var(--status-warning)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: 'var(--radius-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bell size={24} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>Tablero de Alertas y Notificaciones</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Monitoreo y escalamiento de plazos de cumplimiento institucionales.
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflowX: 'auto', paddingBottom: '1rem' }}>
        
        <KanbanColumn 
          title="A Tiempo" 
          icon={<Clock size={20} color="var(--status-info)" />} 
          alerts={onTimeAlerts} 
          colorHex="var(--status-info)"
          emptyMsg="No hay tareas a tiempo"
        />

        <KanbanColumn 
          title="Próximo a Vencer" 
          icon={<AlertTriangle size={20} color="var(--status-warning)" />} 
          alerts={nearingAlerts} 
          colorHex="var(--status-warning)"
          emptyMsg="No hay tareas próximas a vencer"
        />

        <KanbanColumn 
          title="Vencido" 
          icon={<XCircle size={20} color="var(--status-critical)" />} 
          alerts={overdueAlerts} 
          colorHex="var(--status-critical)"
          emptyMsg="¡Excelente! No hay tareas vencidas"
        />

      </div>
    </div>
  );
};

// Tarjeta Individual de Alerta
const AlertCard = ({ alert, onEscalate, onNavigate, colorHex }) => {
  return (
    <Card style={{ padding: '1rem', borderLeft: `4px solid ${colorHex}`, position: 'relative', overflow: 'hidden' }}>
      {alert.escalated && (
        <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--status-warning)', color: 'white', padding: '0.2rem 1rem', fontSize: '0.7rem', fontWeight: 'bold', borderBottomLeftRadius: '4px' }}>
          ESCALADO / POA
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: alert.escalated ? '0.5rem' : '0' }}>
        <Badge status="default">{alert.auditId}</Badge>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: colorHex }}>
          {alert.daysRemaining < 0 
            ? `Vencido por ${Math.abs(alert.daysRemaining)} días` 
            : `Faltan ${alert.daysRemaining} días`}
        </span>
      </div>
      
      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{alert.title}</h4>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
        {alert.description}
      </p>
      
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        <strong>Vencimiento:</strong> {alert.targetDate}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
        {alert.status === 'vencido' && !alert.escalated && alert.type === 'PAC' && (
          <Button variant="outline" size="sm" onClick={() => onEscalate(alert.id)}>
            <ArrowUpRight size={14} style={{ marginRight: '4px' }} /> Escalar (Aud. Seg.)
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={() => onNavigate(alert.type)}>
          Resolver <ArrowRight size={14} style={{ marginLeft: '4px' }} />
        </Button>
      </div>
    </Card>
  );
};
