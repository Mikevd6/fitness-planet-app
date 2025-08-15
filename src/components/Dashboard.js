import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFromStorage } from '../utils/localStorage';
import '../styles/Dashboard.css';

function Dashboard({ currentUser }) {
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    caloriesToday: 0,
    weightProgress: 0,
    goalsCompleted: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const workouts = getFromStorage('workouts') || [];
      const nutrition = getFromStorage('nutrition') || [];
      const progress = getFromStorage('progress') || [];

      // Calculate workouts this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const workoutsThisWeek = workouts.filter(workout => 
        new Date(workout.date) >= oneWeekAgo
      ).length;

      // Calculate calories today
      const today = new Date().toDateString();
      const caloriesToday = nutrition
        .filter(meal => new Date(meal.date).toDateString() === today)
        .reduce((total, meal) => total + (meal.calories || 0), 0);

      // Calculate weight progress (difference between latest and earliest)
      let weightProgress = 0;
      if (progress.length >= 2) {
        const sortedProgress = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstWeight = sortedProgress[0].weight;
        const lastWeight = sortedProgress[sortedProgress.length - 1].weight;
        weightProgress = lastWeight - firstWeight;
      }

      // Calculate goals completed (simplified)
      const goalsCompleted = Math.min(workoutsThisWeek, 5); // Max 5 goals per week

      setStats({
        workoutsThisWeek,
        caloriesToday,
        weightProgress,
        goalsCompleted
      });
    };

    calculateStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welkom terug, {currentUser?.username}! 👋</h1>
        <p>Hier is je fitness overzicht van vandaag.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏋️‍♂️</div>
          <div className="stat-content">
            <h3>Trainingen deze week</h3>
            <p className="stat-number">{stats.workoutsThisWeek}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Calorieën vandaag</h3>
            <p className="stat-number">{stats.caloriesToday}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <h3>Gewicht voortgang</h3>
            <p className="stat-number">
              {stats.weightProgress > 0 ? '+' : ''}{stats.weightProgress.toFixed(1)} kg
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Doelen behaald</h3>
            <p className="stat-number">{stats.goalsCompleted}/5</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Snelle acties</h2>
        <div className="actions-grid">
          <Link to="/workouts" className="action-card">
            <div className="action-icon">💪</div>
            <h3>Nieuwe workout</h3>
            <p>Log je training van vandaag</p>
          </Link>

          <Link to="/voeding" className="action-card">
            <div className="action-icon">🍎</div>
            <h3>Voeding toevoegen</h3>
            <p>Registreer je maaltijd</p>
          </Link>

          <Link to="/voortgang" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Voortgang bijwerken</h3>
            <p>Log je gewicht en doelen</p>
          </Link>

          <Link to="/profiel" className="action-card">
            <div className="action-icon">⚙️</div>
            <h3>Profiel instellen</h3>
            <p>Pas je instellingen aan</p>
          </Link>
        </div>
      </div>

      <div className="motivational-section">
        <div className="motivation-card">
          <h3>💡 Tip van de dag</h3>
          <p>
            Consistentie is belangrijker dan perfectie. Elke kleine stap telt naar je doel!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;