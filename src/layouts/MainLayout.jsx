import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';

export const MainLayout = ({ children }) => {
  const { currentUser: user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-light)' }}>
      {/* Overlay Backdrop para el menú en móvil */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={closeSidebar}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="main-content" style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s ease' }}>
        <Header user={user} onToggleSidebar={toggleSidebar} />
        
        <main className="app-main" style={{ 
          flex: 1, 
          padding: '2rem', 
          maxWidth: '1600px', 
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          minWidth: 0
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};
