// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const previousLocation = useRef(location.pathname);

  // Função logout com useCallback para evitar recriações
  const logout = useCallback(() => {
    // Limpa tudo relacionado à autenticação
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    setIsAuthenticated(false);
    setUser(null);
    
    console.log('Logout realizado com sucesso');
  }, []);

  // Monitora mudanças de rota
  useEffect(() => {
    // Verifica se estava no /admin e está saindo
    if (previousLocation.current === '/admin' && 
        location.pathname !== '/admin' && 
        isAuthenticated) {
      console.log('Saindo da área administrativa - fazendo logout automático');
      logout();
    }
    
    // Atualiza a referência da localização anterior
    previousLocation.current = location.pathname;
  }, [location.pathname, isAuthenticated, logout]);

  // Verifica se há token válido ao carregar
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Só executa na montagem

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        // Token inválido, limpa o localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Salva token e informações do usuário
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setIsAuthenticated(true);
        setUser(data.user);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Erro ao fazer login' 
        };
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        error: 'Erro de conexão com o servidor' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loading,
      user,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};