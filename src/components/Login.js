import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Gebruikersnaam is verplicht';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Gebruikersnaam moet minimaal 3 karakters bevatten';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Wachtwoord is verplicht';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Wachtwoord moet minimaal 4 karakters bevatten';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Simple demo authentication - accept any valid username/password
      const userData = {
        username: formData.username,
        loginTime: new Date().toISOString()
      };
      
      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setFormData({
      username: 'demo',
      password: 'demo'
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🌍</span>
              <h1>Fitness Planet</h1>
            </div>
            <p className="login-subtitle">Welkom terug! Log in om verder te gaan.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                👤 Gebruikersnaam
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Voer je gebruikersnaam in"
                disabled={isLoading}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                🔒 Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Voer je wachtwoord in"
                disabled={isLoading}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Inloggen...
                </>
              ) : (
                <>
                  🚀 Inloggen
                </>
              )}
            </button>

            <div className="login-demo">
              <p>Voor demo doeleinden:</p>
              <button 
                type="button" 
                className="demo-btn"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                ✨ Demo gegevens invullen
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>🎯 Track je workouts, voeding en voortgang</p>
            <p>📱 Responsive design voor alle apparaten</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;