import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { alertService } from '../services/alertService';
import { useNavigate } from 'react-router-dom';

export const Header = ({ user, onToggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Toggle theme logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Cargar cantidad de alertas críticas o próximas
    alertService.getAlerts().then(alerts => {
      const activeAlerts = alerts.filter(a => a.status === 'vencido' || a.status === 'proximo').length;
      setAlertCount(activeAlerts);
    });
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header style={{
      height: '80px',
      backgroundColor: 'var(--surface-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Botón Hamburguesa (solo móvil) */}
      <button 
        className="mobile-only-btn"
        onClick={onToggleSidebar}
        style={{ color: 'var(--text-primary)', padding: '0.5rem', marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <Menu size={24} />
      </button>

      {/* Search Bar Desktop / Mobile Collapsed */}
      <div 
        className={isSearchExpanded ? 'mobile-search-active' : ''}
        style={{
          position: isSearchExpanded ? 'absolute' : 'relative',
          left: isSearchExpanded ? 0 : 'auto',
          top: isSearchExpanded ? 0 : 'auto',
          width: isSearchExpanded ? '100%' : '400px',
          height: isSearchExpanded ? '100%' : 'auto',
          backgroundColor: isSearchExpanded ? 'var(--surface-light)' : 'transparent',
          zIndex: isSearchExpanded ? 100 : 1,
          display: 'flex',
          alignItems: 'center',
          padding: isSearchExpanded ? '0 1rem' : 0,
          transition: 'all 0.3s ease'
        }}
      >
        {!isSearchExpanded && (
          <button 
            className="mobile-only-btn"
            onClick={() => {
              setIsSearchExpanded(true);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            style={{ color: 'var(--text-secondary)', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Search size={20} />
          </button>
        )}

        <div style={{
          position: 'relative',
          width: '100%',
          display: isSearchExpanded ? 'block' : 'block' // En index.css controlaremos que el input se esconda en móvil si no está expandido
        }} className={!isSearchExpanded ? 'hide-search-input-mobile' : ''}>
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
          }}>
            <Search size={18} />
          </div>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Buscar auditorías, hallazgos o usuarios..." 
            style={{
              width: '100%',
              padding: '10px 10px 10px 40px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--surface-card)',
              color: 'var(--text-primary)',
              fontSize: '1rem', // 1rem previene zoom en iOS
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-accent)'}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-light)';
              // Opcional: cerrar al perder foco
              // setIsSearchExpanded(false);
            }}
          />
          {isSearchExpanded && (
            <button 
              onClick={() => setIsSearchExpanded(false)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          style={{
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-card)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-accent)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div 
          style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)' }}
          onClick={() => navigate('/alerts')}
        >
          <Bell size={24} />
          {alertCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--status-critical)',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '2px solid var(--surface-light)'
            }}>{alertCount}</span>
          )}
        </div>

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '1rem', borderLeft: '1px solid var(--border-light)' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{user?.name || 'Cargando...'}</p>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user?.role || 'Rol'}</p>
          </div>
          <Avatar name={user?.name} initials={user?.avatar} size={40} />
        </div>
      </div>
    </header>
  );
};
