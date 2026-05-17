import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';

// Páginas
import { Dashboard } from './pages/Dashboard';
import { AuditPlanning } from './pages/AuditPlanning';
import { AuditExecution } from './pages/AuditExecution';
import { Findings } from './pages/Findings';
import { Reports } from './pages/Reports';
import { PACManagement } from './pages/PACManagement';
import { UserManagement } from './pages/UserManagement';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';

/**
 * Componente interno que decide qué renderizar según el estado de autenticación.
 * Separado de App para poder usar useAuth() dentro de AuthProvider.
 */
const AppRouter = () => {
  const { authStep, loading } = useAuth();

  // Pantalla de carga inicial mientras se verifica la sesión
  if (loading && authStep === 'idle') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1B2A4A 40%, #2D4A7A 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#4A90D9',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>Cargando SAI...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Si no está autenticado (o está en paso 2FA), mostrar Login
  if (authStep === 'unauthenticated' || authStep === '2fa') {
    return (
      <Router>
        <Login />
      </Router>
    );
  }

  // Autenticado — mostrar la app completa
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planning" element={<AuditPlanning />} />
          <Route path="/execution" element={<AuditExecution />} />
          <Route path="/findings" element={<Findings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/pac" element={<PACManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
