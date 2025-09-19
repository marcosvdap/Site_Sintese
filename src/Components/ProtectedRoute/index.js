// Components/ProtectedRoute/index.js
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProtectedRoute.module.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Sempre verifica autenticação quando acessa rota protegida
    if (checkAuth) {
      checkAuth();
    }
    
    // Desabilita cache da página para forçar verificação
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }, [location, checkAuth]);

  // Previne acesso via histórico do navegador
  useEffect(() => {
    // Remove a página do histórico de navegação
    window.history.replaceState(null, '', window.location.href);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Verificando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Limpa qualquer dado residual
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

