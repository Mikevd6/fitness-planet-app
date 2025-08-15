import React, { useState } from 'react';
import { saveToStorage, initializeData } from '../utils/localStorage';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!username.trim() || !password.trim()) {
      setError('Vul alle velden in');
      return;
    }

    if (password.length < 4) {
      setError('Wachtwoord moet minimaal 4 karakters bevatten');
      return;
    }

    // Create user object
    const user = {
      username: username.trim(),
      loginTime: new Date().toISOString()
    };

    // Save to localStorage
    saveToStorage('currentUser', user);
    
    // Initialize data structure
    initializeData();
    
    // Call parent login handler
    onLogin(user);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🌍 Fitness Planet</h1>
          <p>Welkom bij je persoonlijke fitness companion</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Gebruikersnaam</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Voer je gebruikersnaam in"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Wachtwoord</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Voer je wachtwoord in"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Inloggen
          </button>
        </form>

        <div className="login-footer">
          <p>
            <small>
              Demo: Gebruik een willekeurige gebruikersnaam en wachtwoord (min. 4 karakters)
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;