import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
export const AppContext = createContext();

// Hook personalizado
export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(note => note.id !== id));
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
    globalLoading,
    setGlobalLoading,
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
