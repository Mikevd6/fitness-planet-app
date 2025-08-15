import React, { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import '../styles/ProgressTracker.css';

function ProgressTracker() {
  const [progressData, setProgressData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState({
    targetWeight: '',
    weeklyGoal: '',
    dailyCalories: ''
  });
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    notes: ''
  });

  useEffect(() => {
    const savedProgress = getFromStorage('progress') || [];
    const savedGoals = getFromStorage('goals') || {
      targetWeight: '',
      weeklyGoal: '',
      dailyCalories: ''
    };
    
    setProgressData(savedProgress);
    setGoals(savedGoals);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newEntry.weight) {
      alert('Vul minimaal je gewicht in');
      return;
    }

    const entry = {
      id: Date.now(),
      weight: parseFloat(newEntry.weight),
      bodyFat: parseFloat(newEntry.bodyFat) || null,
      notes: newEntry.notes,
      date: new Date().toISOString()
    };

    const updatedProgress = [entry, ...progressData];
    setProgressData(updatedProgress);
    saveToStorage('progress', updatedProgress);

    // Reset form
    setNewEntry({
      weight: '',
      bodyFat: '',
      notes: ''
    });
    setShowForm(false);
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Weet je zeker dat je deze entry wilt verwijderen?')) {
      const updatedProgress = progressData.filter(entry => entry.id !== id);
      setProgressData(updatedProgress);
      saveToStorage('progress', updatedProgress);
    }
  };

  const handleGoalUpdate = (e) => {
    e.preventDefault();
    saveToStorage('goals', goals);
    alert('Doelen opgeslagen!');
  };

  // Calculate BMI for latest entry
  const calculateBMI = (weight, height = 175) => {
    if (!weight || !height) return null;
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  // Get latest weight
  const latestWeight = progressData.length > 0 ? progressData[0].weight : null;
  const bmi = latestWeight ? calculateBMI(latestWeight) : null;

  // Calculate weight change
  const weightChange = () => {
    if (progressData.length < 2) return 0;
    const sorted = [...progressData].sort((a, b) => new Date(a.date) - new Date(b.date));
    return (sorted[sorted.length - 1].weight - sorted[0].weight).toFixed(1);
  };

  // Simple line chart data (for CSS visualization)
  const chartData = progressData
    .slice(-7) // Last 7 entries
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(entry => entry.weight);

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h1>📊 Voortgang Tracker</h1>
        <button 
          className="add-entry-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuleren' : 'Nieuwe Entry'}
        </button>
      </div>

      {showForm && (
        <div className="entry-form-container">
          <form onSubmit={handleSubmit} className="entry-form">
            <h2>Nieuwe Voortgang Entry</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Gewicht (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  id="weight"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                  placeholder="75.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bodyFat">Vetpercentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  id="bodyFat"
                  value={newEntry.bodyFat}
                  onChange={(e) => setNewEntry({...newEntry, bodyFat: e.target.value})}
                  placeholder="15.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notities</label>
              <textarea
                id="notes"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                placeholder="Hoe voel je je vandaag? Bijzonderheden?"
                rows="3"
              />
            </div>

            <button type="submit" className="submit-btn">
              Entry Opslaan
            </button>
          </form>
        </div>
      )}

      <div className="progress-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon">⚖️</div>
            <div className="card-content">
              <h3>Huidig Gewicht</h3>
              <p className="card-number">
                {latestWeight ? `${latestWeight} kg` : 'Geen data'}
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Gewichtsverandering</h3>
              <p className="card-number">
                {progressData.length >= 2 ? `${weightChange()} kg` : 'Geen data'}
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🔢</div>
            <div className="card-content">
              <h3>BMI</h3>
              <p className="card-number">
                {bmi ? bmi : 'Geen data'}
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <h3>Doel Gewicht</h3>
              <p className="card-number">
                {goals.targetWeight ? `${goals.targetWeight} kg` : 'Niet ingesteld'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="goals-section">
        <h2>Doelen Instellen</h2>
        <form onSubmit={handleGoalUpdate} className="goals-form">
          <div className="goals-row">
            <div className="form-group">
              <label htmlFor="targetWeight">Doel Gewicht (kg)</label>
              <input
                type="number"
                step="0.1"
                id="targetWeight"
                value={goals.targetWeight}
                onChange={(e) => setGoals({...goals, targetWeight: e.target.value})}
                placeholder="70"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weeklyGoal">Wekelijks Doel (kg/week)</label>
              <input
                type="number"
                step="0.1"
                id="weeklyGoal"
                value={goals.weeklyGoal}
                onChange={(e) => setGoals({...goals, weeklyGoal: e.target.value})}
                placeholder="0.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dailyCalories">Dagelijks Calorie Doel</label>
              <input
                type="number"
                id="dailyCalories"
                value={goals.dailyCalories}
                onChange={(e) => setGoals({...goals, dailyCalories: e.target.value})}
                placeholder="2000"
              />
            </div>
          </div>

          <button type="submit" className="goals-submit-btn">
            Doelen Opslaan
          </button>
        </form>
      </div>

      {chartData.length > 1 && (
        <div className="chart-section">
          <h2>Gewichtsverloop (Laatste 7 metingen)</h2>
          <div className="simple-chart">
            {chartData.map((weight, index) => (
              <div 
                key={index} 
                className="chart-bar"
                style={{
                  height: `${Math.max(10, (weight - Math.min(...chartData)) / (Math.max(...chartData) - Math.min(...chartData)) * 100)}%`
                }}
                title={`${weight} kg`}
              >
                <span className="chart-value">{weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bmi-calculator">
        <h2>BMI Informatie</h2>
        <div className="bmi-info">
          <div className="bmi-ranges">
            <div className="bmi-range">
              <span className="range-label">Ondergewicht:</span>
              <span className="range-value">&lt; 18.5</span>
            </div>
            <div className="bmi-range">
              <span className="range-label">Normaal gewicht:</span>
              <span className="range-value">18.5 - 24.9</span>
            </div>
            <div className="bmi-range">
              <span className="range-label">Overgewicht:</span>
              <span className="range-value">25.0 - 29.9</span>
            </div>
            <div className="bmi-range">
              <span className="range-label">Obesitas:</span>
              <span className="range-value">&gt; 30.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-list">
        <h2>Voortgang Geschiedenis</h2>
        {progressData.length === 0 ? (
          <div className="empty-state">
            <p>Nog geen voortgang geregistreerd. Voeg je eerste meting toe!</p>
          </div>
        ) : (
          progressData.map(entry => (
            <div key={entry.id} className="progress-card">
              <div className="progress-info">
                <div className="progress-main">
                  <h4>{entry.weight} kg</h4>
                  <span className="progress-date">
                    {new Date(entry.date).toLocaleDateString('nl-NL')}
                  </span>
                </div>
                <div className="progress-details">
                  {entry.bodyFat && (
                    <span className="body-fat">Vet: {entry.bodyFat}%</span>
                  )}
                  {entry.notes && (
                    <p className="progress-notes">{entry.notes}</p>
                  )}
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteEntry(entry.id)}
                title="Verwijder entry"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;