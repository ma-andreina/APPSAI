import React from 'react';
import { Badge } from '../ui/Badge';

export const KanbanColumn = ({ title, status, count, children }) => {
  return (
    <div style={{
      flex: 1,
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: 'var(--surface-light)',
      borderRadius: 'var(--radius-card)',
      padding: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <Badge status={status}>{title}</Badge>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
          {count}
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );
};
