import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  CalendarDays,
  CheckSquare,
  FileText,
  Wrench,
  Users,
  Bell,
  Settings,
  LogOut,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { name: 'Planificación', icon: <CalendarDays size={20} />, path: '/planning' },
    { name: 'Ejecución ISO 27001', icon: <CheckSquare size={20} />, path: '/execution' },
    { name: 'Registro de Hallazgos', icon: <FileText size={20} />, path: '/findings' },
    { name: 'Informes', icon: <FileText size={20} />, path: '/reports' },
    { name: 'Acciones Correctivas', icon: <Wrench size={20} />, path: '/pac' },
    { name: 'Usuarios', icon: <Users size={20} />, path: '/users' },
    { name: 'Alertas', icon: <Bell size={20} />, path: '/alerts' },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className={`sidebar-drawer ${isOpen ? 'open' : ''}`} style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--brand-primary)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'transform 0.3s ease',
      zIndex: 100
    }}>
      {/* Logo Area */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          width: '45px',
          height: '45px',
          backgroundColor: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img
            src="/logo_cmp.svg"
            alt="CMP Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'white', fontWeight: 'bold' }}>SAI - CMP</h2>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Auditoría Informática</span>
        </div>
        <button 
          className="mobile-only-btn" 
          onClick={onClose}
          style={{ marginLeft: 'auto', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-button)',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive ? 'var(--brand-accent)' : 'transparent',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  fontWeight: isActive ? '500' : '400'
                })}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Area / Logout */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'rgba(255,255,255,0.7)',
          width: '100%',
          padding: '10px 16px',
          borderRadius: 'var(--radius-button)',
          transition: 'all 0.2s',
          cursor: 'pointer',
          border: 'none',
          backgroundColor: 'transparent'
        }}
          onClick={logout}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
