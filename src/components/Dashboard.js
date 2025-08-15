import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../utils/localStorage';
import '../styles/Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    weeklyWorkouts: 0,
    todayCalories: 0,
    currentWeight: 0,
    goalProgress: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    // Calculate weekly workouts
    const workouts = storage.getWorkouts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(workout => 
      new Date(workout.datum) >= oneWeekAgo
    ).length;

    // Calculate today's calories
    const nutrition = storage.getNutrition();
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = nutrition.filter(meal => meal.datum === today);
    const todayCalories = todayMeals.reduce((total, meal) => total + (meal.calorieën || 0), 0);

    // Get current weight
    const progress = storage.getProgress();
    const currentWeight = progress.length > 0 ? progress[0].gewicht : 0;

    // Calculate goal progress (example: weekly workout goal)
    const goals = storage.getGoals();
    const goalProgress = Math.min((weeklyWorkouts / goals.weeklyWorkouts) * 100, 100);

    setStats({
      weeklyWorkouts,
      todayCalories,
      currentWeight,
      goalProgress: Math.round(goalProgress)
    });
  };

  const quickActions = [
    {
      title: 'Nieuwe Workout',
      description: 'Voeg een workout toe',
      icon: '💪',
      link: '/workouts',
      color: 'blue'
    },
    {
      title: 'Maaltijd Toevoegen',
      description: 'Track je voeding',
      icon: '🥗',
      link: '/voeding',
      color: 'green'
    },
    {
      title: 'Gewicht Invoeren',
      description: 'Update je voortgang',
      icon: '⚖️',
      link: '/voortgang',
      color: 'purple'
    },
    {
      title: 'Profiel Bewerken',
      description: 'Pas je instellingen aan',
      icon: '👤',
      link: '/profiel',
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="welcome-message">
            Welkom terug, {user.username}! 🎯
          </p>
          <p className="date-info">
            {new Date().toLocaleDateString('nl-NL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card workouts">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <h3>Trainingen deze week</h3>
              <div className="stat-number">{stats.weeklyWorkouts}</div>
              <p className="stat-description">
                {stats.weeklyWorkouts >= 3 ? 'Geweldig! Je bent op schema' : 'Ga zo door!'}
              </p>
            </div>
          </div>

          <div className="stat-card calories">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>Calorieën vandaag</h3>
              <div className="stat-number">{stats.todayCalories}</div>
              <p className="stat-description">
                {stats.todayCalories > 0 ? 'Goed bezig met tracken!' : 'Begin met het toevoegen van maaltijden'}
              </p>
            </div>
          </div>

          <div className="stat-card weight">
            <div className="stat-icon">⚖️</div>
            <div className="stat-content">
              <h3>Huidig gewicht</h3>
              <div className="stat-number">
                {stats.currentWeight > 0 ? `${stats.currentWeight} kg` : 'Niet ingesteld'}
              </div>
              <p className="stat-description">
                {stats.currentWeight > 0 ? 'Blijf je voortgang bijhouden' : 'Voeg je eerste gewichtsmeting toe'}
              </p>
            </div>
          </div>

          <div className="stat-card goals">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Doel voortgang</h3>
              <div className="stat-number">{stats.goalProgress}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{width: `${stats.goalProgress}%`}}
                ></div>
              </div>
              <p className="stat-description">
                Wekelijks workout doel
              </p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Snelle Acties</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                to={action.link} 
                className={`action-card ${action.color}`}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recente Activiteit</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const workouts = storage.getWorkouts().slice(0, 2);
    const nutrition = storage.getNutrition().slice(0, 2);
    const progress = storage.getProgress().slice(0, 1);

    const allItems = [
      ...workouts.map(w => ({
        type: 'workout',
        icon: '💪',
        text: `Workout: ${w.naam}`,
        date: w.datum,
        detail: `${w.duur} min, ${w.calorieën} cal`
      })),
      ...nutrition.map(m => ({
        type: 'nutrition',
        icon: '🥗',
        text: `Maaltijd: ${m.naam}`,
        date: m.datum,
        detail: `${m.calorieën} calorieën`
      })),
      ...progress.map(p => ({
        type: 'progress',
        icon: '⚖️',
        text: 'Gewicht bijgewerkt',
        date: p.datum,
        detail: `${p.gewicht} kg`
      }))
    ];

    // Sort by date and take latest 4
    allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentItems(allItems.slice(0, 4));
  }, []);

  if (recentItems.length === 0) {
    return (
      <div className="no-activity">
        <p>Nog geen recente activiteit. Begin met het toevoegen van workouts, maaltijden of gewichtsmetingen!</p>
      </div>
    );
  }

  return (
    <div className="activity-list">
      {recentItems.map((item, index) => (
        <div key={index} className="activity-item">
          <div className="activity-icon">{item.icon}</div>
          <div className="activity-content">
            <p className="activity-text">{item.text}</p>
            <p className="activity-detail">{item.detail}</p>
          </div>
          <div className="activity-date">
            {new Date(item.date).toLocaleDateString('nl-NL')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;