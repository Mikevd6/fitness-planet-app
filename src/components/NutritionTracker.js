import React, { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import '../styles/NutritionTracker.css';

function NutritionTracker() {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMeal, setNewMeal] = useState({
    naam: '',
    calories: '',
    eiwitten: '',
    koolhydraten: '',
    vetten: ''
  });

  useEffect(() => {
    const savedMeals = getFromStorage('nutrition') || [];
    setMeals(savedMeals);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newMeal.naam || !newMeal.calories) {
      alert('Vul minimaal naam en calorieën in');
      return;
    }

    const meal = {
      id: Date.now(),
      ...newMeal,
      calories: parseInt(newMeal.calories),
      eiwitten: parseFloat(newMeal.eiwitten) || 0,
      koolhydraten: parseFloat(newMeal.koolhydraten) || 0,
      vetten: parseFloat(newMeal.vetten) || 0,
      date: new Date().toISOString()
    };

    const updatedMeals = [meal, ...meals];
    setMeals(updatedMeals);
    saveToStorage('nutrition', updatedMeals);

    // Reset form
    setNewMeal({
      naam: '',
      calories: '',
      eiwitten: '',
      koolhydraten: '',
      vetten: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Weet je zeker dat je deze maaltijd wilt verwijderen?')) {
      const updatedMeals = meals.filter(meal => meal.id !== id);
      setMeals(updatedMeals);
      saveToStorage('nutrition', updatedMeals);
    }
  };

  // Filter meals by selected date
  const filteredMeals = meals.filter(meal => {
    const mealDate = new Date(meal.date).toISOString().split('T')[0];
    return mealDate === selectedDate;
  });

  // Calculate daily totals for selected date
  const dailyTotals = filteredMeals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    eiwitten: totals.eiwitten + meal.eiwitten,
    koolhydraten: totals.koolhydraten + meal.koolhydraten,
    vetten: totals.vetten + meal.vetten
  }), { calories: 0, eiwitten: 0, koolhydraten: 0, vetten: 0 });

  return (
    <div className="nutrition-tracker">
      <div className="nutrition-header">
        <h1>🍎 Voeding Tracker</h1>
        <button 
          className="add-meal-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuleren' : 'Maaltijd Toevoegen'}
        </button>
      </div>

      {showForm && (
        <div className="meal-form-container">
          <form onSubmit={handleSubmit} className="meal-form">
            <h2>Nieuwe Maaltijd Toevoegen</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="naam">Maaltijd Naam *</label>
                <input
                  type="text"
                  id="naam"
                  value={newMeal.naam}
                  onChange={(e) => setNewMeal({...newMeal, naam: e.target.value})}
                  placeholder="Bijv. Ontbijt, Lunch, Snack"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="calories">Calorieën *</label>
                <input
                  type="number"
                  id="calories"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  placeholder="400"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eiwitten">Eiwitten (g)</label>
                <input
                  type="number"
                  step="0.1"
                  id="eiwitten"
                  value={newMeal.eiwitten}
                  onChange={(e) => setNewMeal({...newMeal, eiwitten: e.target.value})}
                  placeholder="25"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="koolhydraten">Koolhydraten (g)</label>
                <input
                  type="number"
                  step="0.1"
                  id="koolhydraten"
                  value={newMeal.koolhydraten}
                  onChange={(e) => setNewMeal({...newMeal, koolhydraten: e.target.value})}
                  placeholder="50"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vetten">Vetten (g)</label>
                <input
                  type="number"
                  step="0.1"
                  id="vetten"
                  value={newMeal.vetten}
                  onChange={(e) => setNewMeal({...newMeal, vetten: e.target.value})}
                  placeholder="15"
                  min="0"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Maaltijd Opslaan
            </button>
          </form>
        </div>
      )}

      <div className="date-selector">
        <label htmlFor="date">Datum selecteren:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="daily-summary">
        <h2>Dagelijkse Samenvatting - {new Date(selectedDate).toLocaleDateString('nl-NL')}</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">🔥</div>
            <div className="summary-content">
              <h3>Calorieën</h3>
              <p className="summary-number">{dailyTotals.calories}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🥩</div>
            <div className="summary-content">
              <h3>Eiwitten</h3>
              <p className="summary-number">{dailyTotals.eiwitten.toFixed(1)}g</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🍞</div>
            <div className="summary-content">
              <h3>Koolhydraten</h3>
              <p className="summary-number">{dailyTotals.koolhydraten.toFixed(1)}g</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🥑</div>
            <div className="summary-content">
              <h3>Vetten</h3>
              <p className="summary-number">{dailyTotals.vetten.toFixed(1)}g</p>
            </div>
          </div>
        </div>
      </div>

      <div className="meals-list">
        <h3>Maaltijden</h3>
        {filteredMeals.length === 0 ? (
          <div className="empty-state">
            <p>Geen maaltijden gevonden voor deze datum. Voeg je eerste maaltijd toe!</p>
          </div>
        ) : (
          filteredMeals.map(meal => (
            <div key={meal.id} className="meal-card">
              <div className="meal-info">
                <h4>{meal.naam}</h4>
                <div className="meal-details">
                  <span className="meal-calories">{meal.calories} cal</span>
                  <span className="meal-protein">E: {meal.eiwitten}g</span>
                  <span className="meal-carbs">K: {meal.koolhydraten}g</span>
                  <span className="meal-fats">V: {meal.vetten}g</span>
                  <span className="meal-time">
                    {new Date(meal.date).toLocaleTimeString('nl-NL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(meal.id)}
                title="Verwijder maaltijd"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      <div className="nutrition-tips">
        <h3>💡 Voedingstips</h3>
        <div className="tip-card">
          <p>
            <strong>Dagelijkse aanbeveling:</strong> Streef naar 1.6-2.2g eiwit per kg lichaamsgewicht, 
            45-65% calorieën uit koolhydraten, en 20-35% uit gezonde vetten.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NutritionTracker;