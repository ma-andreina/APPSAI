import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';

export const MainLayout = ({ children }) => {
  const { currentUser: user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-light)' }}>
      <Sidebar />
      
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        
        <main style={{ 
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
