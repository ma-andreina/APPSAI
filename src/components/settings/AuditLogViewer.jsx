import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Skeleton } from '../ui/Skeleton';
import { Shield, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const ACTION_COLORS = {
  LOGIN: 'in-progress', CREATE: 'closed', UPDATE: 'review',
  SIGN: 'closed', UPLOAD: 'in-progress', EXPORT: 'default',
  REVIEW: 'review', CONFIG: 'critical', DELETE: 'critical'
};

const ACTION_LABELS = {
  LOGIN: 'Sesión', CREATE: 'Creación', UPDATE: 'Actualización',
  SIGN: 'Firma', UPLOAD: 'Carga', EXPORT: 'Exportación',
  REVIEW: 'Revisión', CONFIG: 'Config', DELETE: 'Eliminación'
};

const ITEMS_PER_PAGE = 8;

export const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', userId: '', actionType: '' });

  const userOptions = [
    { value: '1', label: 'Carlos Mendoza' }, { value: '2', label: 'Ana Silva' },
    { value: '3', label: 'Luis Ramos' }, { value: '4', label: 'María Gonzalez' },
    { value: '5', label: 'José Pérez' }, { value: '6', label: 'Laura Gómez' },
    { value: '7', label: 'Pedro Díaz' }
  ];

  const actionOptions = Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label }));

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async (applied = {}) => {
    setLoading(true);
    try {
      const data = await settingsService.getAuditLogs(applied);
      setLogs(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error al cargar bitácora:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    const active = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) active[k] = v; });
    fetchLogs(active);
  };

  const handleClearFilters = () => {
    setFilters({ startDate: '', endDate: '', userId: '', actionType: '' });
    fetchLogs({});
  };

  const totalPages = Math.max(1, Math.ceil(logs.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = logs.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const formatTs = (ts) => new Date(ts).toLocaleString('es-VE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const dateInputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '8px',
    border: '1px solid var(--border-light)', backgroundColor: 'var(--surface-light)',
    color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.95rem'
  };

  const labelStyle = {
    display: 'block', marginBottom: '0.5rem', fontWeight: 500,
    color: 'var(--text-secondary)', fontSize: '0.875rem'
  };

  return (
    <div>
      {/* Integrity Banner */}
      <Card style={{
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-light) 100%)',
        color: 'white', display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <Shield size={28} style={{ flexShrink: 0, opacity: 0.9 }} />
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'white' }}>Bitácora Inalterable</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>
            Registro protegido según Norma 12 del Manual de Auditoría de Estado (CGR). Las entradas no pueden ser editadas ni eliminadas.
          </p>
        </div>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Filter size={16} color="var(--text-secondary)" />
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Filtros</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0 1rem', alignItems: 'end' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Desde</label>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} style={dateInputStyle} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Hasta</label>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} style={dateInputStyle} />
          </div>
          <Select label="Usuario" name="userId" value={filters.userId} onChange={handleFilterChange} options={userOptions} placeholder="Todos" />
          <Select label="Acción" name="actionType" value={filters.actionType} onChange={handleFilterChange} options={actionOptions} placeholder="Todas" />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="sm" onClick={handleClearFilters}>Limpiar</Button>
          <Button variant="primary" size="sm" onClick={handleApplyFilters} style={{ gap: '6px' }}>
            <Search size={14} /> Buscar
          </Button>
        </div>
      </Card>

      {/* Log Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3,4,5].map(i => <Skeleton key={i} height="48px" borderRadius="8px" />)}
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Shield size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ margin: 0, fontStyle: 'italic' }}>No se encontraron registros.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-light)', borderBottom: '2px solid var(--border-light)' }}>
                    {['Fecha / Hora', 'Usuario', 'Acción', 'Módulo', 'Detalle', 'IP'].map(h => (
                      <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{formatTs(log.timestamp)}</td>
                      <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', fontWeight: 500 }}>{log.userName}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Badge status={ACTION_COLORS[log.action] || 'default'}>{ACTION_LABELS[log.action] || log.action}</Badge>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{log.module}</td>
                      <td style={{ padding: '0.75rem 1rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: '0.85rem' }} title={log.detail}>{log.detail}</td>
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--surface-light)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Mostrando {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, logs.length)} de {logs.length}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--surface-card)', color: currentPage === 1 ? 'var(--border-light)' : 'var(--text-primary)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex' }}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontWeight: 600, minWidth: '60px', textAlign: 'center' }}>{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: 'var(--surface-card)', color: currentPage === totalPages ? 'var(--border-light)' : 'var(--text-primary)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
