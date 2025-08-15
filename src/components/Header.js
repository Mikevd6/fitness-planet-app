import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header({ currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🌍 Fitness Planet</h1>
        </div>

        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/workouts" 
                className={`nav-link ${isActive('/workouts')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Workouts
              </Link>
            </li>
            <li>
              <Link 
                to="/voeding" 
                className={`nav-link ${isActive('/voeding')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Voeding
              </Link>
            </li>
            <li>
              <Link 
                to="/voortgang" 
                className={`nav-link ${isActive('/voortgang')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Voortgang
              </Link>
            </li>
            <li>
              <Link 
                to="/profiel" 
                className={`nav-link ${isActive('/profiel')}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profiel
              </Link>
            </li>
            <li>
              <button 
                className="logout-btn"
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Uitloggen
              </button>
            </li>
          </ul>
        </nav>

        <div className="user-info">
          <span>Welkom, {currentUser?.username || 'Gebruiker'}!</span>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;