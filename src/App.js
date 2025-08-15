import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import ProgressTracker from './components/ProgressTracker';
import ProfileSettings from './components/ProfileSettings';
import { storage } from './utils/localStorage';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    storage.setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    storage.removeUser();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Fitness Planet wordt geladen...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user ? (
          <>
            <Header user={user} onLogout={handleLogout} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/workouts" element={<WorkoutTracker />} />
                <Route path="/voeding" element={<NutritionTracker />} />
                <Route path="/voortgang" element={<ProgressTracker />} />
                <Route path="/profiel" element={<ProfileSettings user={user} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;