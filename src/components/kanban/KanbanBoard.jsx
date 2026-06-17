import React from 'react';

export const KanbanBoard = ({ children }) => {
  return (
    <div className="kanban-board" style={{
      display: 'flex',
      gap: '1.5rem',
      overflowX: 'auto',
      paddingBottom: '1rem',
      height: '100%',
      minHeight: '600px'
    }}>
      {children}
    </div>
  );
};
