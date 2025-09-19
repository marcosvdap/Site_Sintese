import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!credentials.username || !credentials.password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Erro ao fazer login');
      setCredentials({ ...credentials, password: '' });
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <img 
            src="/images/SINTESE_MARCA-1.png" 
            alt="Síntese Bio" 
            className={styles.logo}
          />
          <h2 className={styles.title}>Acesso Administrativo</h2>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Usuário</label>
            <input
              type="text"
              className={styles.input}
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Digite seu usuário"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Senha</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Digite sua senha"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/" className={styles.backLink}>
            ← Voltar para o site
          </Link>
        </div>

        <div className={styles.securityInfo}>
          🔒 Área restrita aos administradores
        </div>
      </div>
    </div>
  );
};

export default Login;