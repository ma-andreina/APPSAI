import React, { useState } from 'react';

export const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{ borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem', display: 'flex', overflowX: 'auto' }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--brand-accent)' : '2px solid transparent',
              color: isActive ? 'var(--brand-accent)' : 'var(--text-secondary)',
              fontWeight: isActive ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span style={{
                backgroundColor: isActive ? 'var(--brand-accent)' : 'var(--surface-hover)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
