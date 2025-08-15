import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import '../styles/ProgressTracker.css';

const ProgressTracker = () => {
  const [weightEntries, setWeightEntries] = useState([]);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightError, setWeightError] = useState('');
  const [bmiData, setBmiData] = useState({ height: '', currentBMI: 0 });
  const [goals, setGoals] = useState({
    weeklyWorkouts: 3,
    dailyCalories: 2000,
    targetWeight: 70
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const progress = storage.getProgress();
    setWeightEntries(progress);
    
    const savedGoals = storage.getGoals();
    setGoals(savedGoals);

    const profile = storage.getProfile();
    if (profile.lengte) {
      const currentWeight = progress.length > 0 ? progress[0].gewicht : 0;
      const heightInM = profile.lengte / 100;
      const currentBMI = currentWeight > 0 ? (currentWeight / (heightInM * heightInM)) : 0;
      
      setBmiData({
        height: profile.lengte,
        currentBMI: currentBMI
      });
    }
  };

  const handleWeightSubmit = (e) => {
    e.preventDefault();
    
    if (!weightInput || weightInput <= 0) {
      setWeightError('Voer een geldig gewicht in');
      return;
    }

    storage.addWeight(weightInput);
    loadData();
    setWeightInput('');
    setWeightError('');
    setShowWeightForm(false);
  };

  const handleDeleteWeight = (id) => {
    if (window.confirm('Weet je zeker dat je deze gewichtsmeting wilt verwijderen?')) {
      storage.deleteWeight(id);
      loadData();
    }
  };

  const handleGoalsSubmit = (e) => {
    e.preventDefault();
    storage.setGoals(goals);
    setShowGoalsForm(false);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Ondergewicht', color: 'blue' };
    if (bmi < 25) return { category: 'Normaal gewicht', color: 'green' };
    if (bmi < 30) return { category: 'Overgewicht', color: 'orange' };
    return { category: 'Obesitas', color: 'red' };
  };

  const getWeightProgress = () => {
    if (weightEntries.length < 2) return null;
    
    const currentWeight = weightEntries[0].gewicht;
    const previousWeight = weightEntries[1].gewicht;
    const difference = currentWeight - previousWeight;
    
    return {
      difference: difference.toFixed(1),
      isIncrease: difference > 0,
      percentage: ((Math.abs(difference) / previousWeight) * 100).toFixed(1)
    };
  };

  const getGoalProgress = () => {
    if (weightEntries.length === 0) return null;
    
    const currentWeight = weightEntries[0].gewicht;
    const targetWeight = goals.targetWeight;
    
    if (currentWeight === targetWeight) {
      return { achieved: true, difference: 0 };
    }
    
    const difference = Math.abs(currentWeight - targetWeight);
    const isAboveTarget = currentWeight > targetWeight;
    
    return {
      achieved: false,
      difference: difference.toFixed(1),
      isAboveTarget,
      message: isAboveTarget 
        ? `${difference.toFixed(1)} kg boven doelgewicht`
        : `${difference.toFixed(1)} kg onder doelgewicht`
    };
  };

  const bmiCategory = getBMICategory(bmiData.currentBMI);
  const weightProgress = getWeightProgress();
  const goalProgress = getGoalProgress();

  return (
    <div className="progress-tracker">
      <div className="progress-container">
        <div className="progress-header">
          <h1>Voortgang Tracker</h1>
          <div className="header-buttons">
            <button 
              className="add-weight-btn"
              onClick={() => setShowWeightForm(!showWeightForm)}
            >
              {showWeightForm ? '❌ Annuleren' : '⚖️ Gewicht Toevoegen'}
            </button>
            <button 
              className="goals-btn"
              onClick={() => setShowGoalsForm(!showGoalsForm)}
            >
              🎯 Doelen
            </button>
          </div>
        </div>

        {showWeightForm && (
          <div className="weight-form-container">
            <form className="weight-form" onSubmit={handleWeightSubmit}>
              <h2>Gewicht Toevoegen</h2>
              <div className="form-group">
                <label htmlFor="weight">Gewicht (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={weightInput}
                  onChange={(e) => {
                    setWeightInput(e.target.value);
                    setWeightError('');
                  }}
                  className={weightError ? 'error' : ''}
                  placeholder="70.5"
                  step="0.1"
                  min="20"
                  max="300"
                />
                {weightError && <span className="error-text">{weightError}</span>}
              </div>
              <button type="submit" className="submit-btn">
                ⚖️ Gewicht Opslaan
              </button>
            </form>
          </div>
        )}

        {showGoalsForm && (
          <div className="goals-form-container">
            <form className="goals-form" onSubmit={handleGoalsSubmit}>
              <h2>Doelen Instellen</h2>
              
              <div className="form-group">
                <label htmlFor="weeklyWorkouts">Trainingen per week</label>
                <input
                  type="number"
                  id="weeklyWorkouts"
                  value={goals.weeklyWorkouts}
                  onChange={(e) => setGoals({...goals, weeklyWorkouts: parseInt(e.target.value) || 0})}
                  min="1"
                  max="14"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dailyCalories">Dagelijkse calorieën doel</label>
                <input
                  type="number"
                  id="dailyCalories"
                  value={goals.dailyCalories}
                  onChange={(e) => setGoals({...goals, dailyCalories: parseInt(e.target.value) || 0})}
                  min="1000"
                  max="5000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="targetWeight">Doelgewicht (kg)</label>
                <input
                  type="number"
                  id="targetWeight"
                  value={goals.targetWeight}
                  onChange={(e) => setGoals({...goals, targetWeight: parseFloat(e.target.value) || 0})}
                  step="0.1"
                  min="30"
                  max="200"
                />
              </div>

              <button type="submit" className="submit-btn">
                🎯 Doelen Opslaan
              </button>
            </form>
          </div>
        )}

        <div className="progress-overview">
          <div className="overview-cards">
            <div className="overview-card">
              <h3>Huidig Gewicht</h3>
              <div className="overview-value">
                {weightEntries.length > 0 ? `${weightEntries[0].gewicht} kg` : 'Niet ingesteld'}
              </div>
              {weightProgress && (
                <div className={`progress-change ${weightProgress.isIncrease ? 'increase' : 'decrease'}`}>
                  {weightProgress.isIncrease ? '↗️' : '↘️'} 
                  {weightProgress.difference} kg ({weightProgress.percentage}%)
                </div>
              )}
            </div>

            <div className="overview-card">
              <h3>BMI</h3>
              <div className="overview-value">
                {bmiData.currentBMI > 0 ? bmiData.currentBMI.toFixed(1) : 'Niet beschikbaar'}
              </div>
              {bmiData.currentBMI > 0 && (
                <div className={`bmi-category ${bmiCategory.color}`}>
                  {bmiCategory.category}
                </div>
              )}
            </div>

            <div className="overview-card">
              <h3>Doelgewicht</h3>
              <div className="overview-value">{goals.targetWeight} kg</div>
              {goalProgress && (
                <div className={`goal-status ${goalProgress.achieved ? 'achieved' : 'pending'}`}>
                  {goalProgress.achieved ? '🎉 Doel bereikt!' : goalProgress.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bmi-calculator">
          <h2>BMI Calculator</h2>
          <BMICalculator />
        </div>

        <div className="weight-chart">
          <h2>Gewichtsverloop</h2>
          <WeightChart entries={weightEntries} />
        </div>

        <div className="weight-history">
          <h2>Gewicht Geschiedenis</h2>
          {weightEntries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⚖️</div>
              <h3>Nog geen gewichtsmetingen</h3>
              <p>Begin met het toevoegen van je eerste gewichtsmeting!</p>
            </div>
          ) : (
            <div className="weight-entries">
              {weightEntries.map((entry) => (
                <div key={entry.id} className="weight-entry">
                  <div className="entry-date">
                    {new Date(entry.datum).toLocaleDateString('nl-NL')}
                  </div>
                  <div className="entry-weight">
                    {entry.gewicht} kg
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteWeight(entry.id)}
                    title="Gewichtsmeting verwijderen"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    if (!height || !weight || height <= 0 || weight <= 0) {
      return;
    }

    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    const category = getBMICategory(bmi);

    setResult({ bmi: bmi.toFixed(1), ...category });
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Ondergewicht', color: 'blue', advice: 'Overweeg een voedingsspecialist te raadplegen.' };
    if (bmi < 25) return { category: 'Normaal gewicht', color: 'green', advice: 'Geweldig! Houd je huidige levensstijl vol.' };
    if (bmi < 30) return { category: 'Overgewicht', color: 'orange', advice: 'Overweeg meer beweging en gezonde voeding.' };
    return { category: 'Obesitas', color: 'red', advice: 'Raadpleeg een arts of voedingsspecialist.' };
  };

  return (
    <div className="bmi-calculator-widget">
      <div className="bmi-inputs">
        <div className="input-group">
          <label>Lengte (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            min="100"
            max="250"
          />
        </div>
        <div className="input-group">
          <label>Gewicht (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            min="20"
            max="300"
            step="0.1"
          />
        </div>
        <button onClick={calculateBMI} className="calculate-btn">
          Bereken BMI
        </button>
      </div>

      {result && (
        <div className="bmi-result">
          <div className="bmi-value">BMI: {result.bmi}</div>
          <div className={`bmi-category ${result.color}`}>
            {result.category}
          </div>
          <div className="bmi-advice">{result.advice}</div>
        </div>
      )}
    </div>
  );
};

const WeightChart = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>Voeg gewichtsmetingen toe om je voortgang te zien</p>
      </div>
    );
  }

  const sortedEntries = [...entries].reverse(); // Oldest first for chart
  const maxWeight = Math.max(...sortedEntries.map(e => e.gewicht));
  const minWeight = Math.min(...sortedEntries.map(e => e.gewicht));
  const range = maxWeight - minWeight || 1;

  return (
    <div className="weight-chart-container">
      <div className="chart-svg">
        <svg viewBox="0 0 800 300" className="chart">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="50"
              y1={50 + (i * 50)}
              x2="750"
              y2={50 + (i * 50)}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          {sortedEntries.length > 1 && (
            <polyline
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3"
              points={sortedEntries.map((entry, index) => {
                const x = 50 + (index * (700 / (sortedEntries.length - 1)));
                const y = 250 - ((entry.gewicht - minWeight) / range * 200);
                return `${x},${y}`;
              }).join(' ')}
            />
          )}
          
          {/* Data points */}
          {sortedEntries.map((entry, index) => {
            const x = 50 + (index * (700 / Math.max(sortedEntries.length - 1, 1)));
            const y = 250 - ((entry.gewicht - minWeight) / range * 200);
            return (
              <g key={entry.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#4f46e5"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {entry.gewicht}kg
                </text>
                <text
                  x={x}
                  y="285"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#666"
                >
                  {new Date(entry.datum).toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' })}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ProgressTracker;