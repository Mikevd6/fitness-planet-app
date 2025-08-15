import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/workouts', label: 'Workouts', icon: '💪' },
    { path: '/voeding', label: 'Voeding', icon: '🥗' },
    { path: '/voortgang', label: 'Voortgang', icon: '📈' },
    { path: '/profiel', label: 'Profiel', icon: '👤' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/dashboard" onClick={closeMenu}>
            <span className="logo-icon">🌍</span>
            <span className="logo-text">Fitness Planet</span>
          </Link>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-footer">
            <div className="user-info">
              <span className="user-greeting">Hallo, {user?.username}!</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span>Uitloggen</span>
            </button>
          </div>
        </nav>

        <button 
          className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menu toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
      </div>
    </header>
  );
};

export default Header;