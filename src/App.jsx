import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';

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

function App() {
  return (
    <AuthProvider>
      <AppProvider>
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
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
