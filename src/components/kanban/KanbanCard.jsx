import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Avatar } from '../ui/Avatar';
import { mockUsers } from '../../services/mockData';

export const KanbanCard = ({ audit, onClick }) => {
  // Encontrar avatares del equipo
  const teamUsers = audit.team.map(userId => mockUsers.find(u => u.id === userId)).filter(Boolean);

  return (
    <Card onClick={onClick} style={{ padding: '1.25rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{audit.title}</h4>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {audit.organism}
        </p>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <ProgressBar progress={audit.progress} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
          {teamUsers.map((user, idx) => (
            <Avatar 
              key={user.id} 
              initials={user.avatar} 
              size={28} 
              style={{ 
                marginLeft: idx > 0 ? '-10px' : '0', 
                border: '2px solid var(--surface-card)' 
              }} 
            />
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {audit.tasks.completed}/{audit.tasks.total}
        </div>
      </div>
    </Card>
  );
};
