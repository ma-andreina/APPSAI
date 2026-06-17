import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isMaximized ? '0' : '2rem'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--surface-card)',
        borderRadius: isMaximized ? '0' : 'var(--radius-card)',
        width: isMaximized ? '100%' : '800px',
        height: isMaximized ? '100%' : '90vh',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={toggleMaximize}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title={isMaximized ? "Minimizar" : "Maximizar"}
            >
              {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};
