import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import '../styles/NutritionTracker.css';

const NutritionTracker = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [formData, setFormData] = useState({
    naam: '',
    calorieën: '',
    eiwitten: '',
    koolhydraten: '',
    vetten: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMeals();
  }, []);

  useEffect(() => {
    filterMeals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meals, dateFilter]);

  const loadMeals = () => {
    const savedMeals = storage.getNutrition();
    setMeals(savedMeals);
  };

  const filterMeals = () => {
    let filtered = meals;

    if (dateFilter) {
      filtered = filtered.filter(meal => meal.datum === dateFilter);
    }

    setFilteredMeals(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.naam.trim()) {
      newErrors.naam = 'Maaltijd naam is verplicht';
    }

    if (!formData.calorieën || formData.calorieën <= 0) {
      newErrors.calorieën = 'Calorieën moet groter zijn dan 0';
    }

    if (!formData.eiwitten || formData.eiwitten < 0) {
      newErrors.eiwitten = 'Eiwitten kan niet negatief zijn';
    }

    if (!formData.koolhydraten || formData.koolhydraten < 0) {
      newErrors.koolhydraten = 'Koolhydraten kan niet negatief zijn';
    }

    if (!formData.vetten || formData.vetten < 0) {
      newErrors.vetten = 'Vetten kan niet negatief zijn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    storage.addMeal({
      naam: formData.naam.trim(),
      calorieën: parseInt(formData.calorieën),
      eiwitten: parseFloat(formData.eiwitten),
      koolhydraten: parseFloat(formData.koolhydraten),
      vetten: parseFloat(formData.vetten)
    });

    loadMeals();
    
    setFormData({
      naam: '',
      calorieën: '',
      eiwitten: '',
      koolhydraten: '',
      vetten: ''
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Weet je zeker dat je deze maaltijd wilt verwijderen?')) {
      storage.deleteMeal(id);
      loadMeals();
    }
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = meals.filter(meal => meal.datum === today);
    
    return todayMeals.reduce((acc, meal) => ({
      calorieën: acc.calorieën + (meal.calorieën || 0),
      eiwitten: acc.eiwitten + (meal.eiwitten || 0),
      koolhydraten: acc.koolhydraten + (meal.koolhydraten || 0),
      vetten: acc.vetten + (meal.vetten || 0)
    }), { calorieën: 0, eiwitten: 0, koolhydraten: 0, vetten: 0 });
  };

  const getFilteredStats = () => {
    return filteredMeals.reduce((acc, meal) => ({
      calorieën: acc.calorieën + (meal.calorieën || 0),
      eiwitten: acc.eiwitten + (meal.eiwitten || 0),
      koolhydraten: acc.koolhydraten + (meal.koolhydraten || 0),
      vetten: acc.vetten + (meal.vetten || 0)
    }), { calorieën: 0, eiwitten: 0, koolhydraten: 0, vetten: 0 });
  };

  const todayStats = getTodayStats();
  const filteredStats = getFilteredStats();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="nutrition-tracker">
      <div className="nutrition-container">
        <div className="nutrition-header">
          <h1>Voeding Tracker</h1>
          <button 
            className="add-meal-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Annuleren' : '➕ Maaltijd Toevoegen'}
          </button>
        </div>

        {showForm && (
          <div className="meal-form-container">
            <form className="meal-form" onSubmit={handleSubmit}>
              <h2>Nieuwe Maaltijd Toevoegen</h2>
              
              <div className="form-group">
                <label htmlFor="naam">Maaltijd/Voedsel</label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  value={formData.naam}
                  onChange={handleInputChange}
                  className={errors.naam ? 'error' : ''}
                  placeholder="Bijv. Havermout met banaan"
                />
                {errors.naam && <span className="error-text">{errors.naam}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="calorieën">Calorieën</label>
                  <input
                    type="number"
                    id="calorieën"
                    name="calorieën"
                    value={formData.calorieën}
                    onChange={handleInputChange}
                    className={errors.calorieën ? 'error' : ''}
                    placeholder="350"
                    min="1"
                  />
                  {errors.calorieën && <span className="error-text">{errors.calorieën}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="eiwitten">Eiwitten (g)</label>
                  <input
                    type="number"
                    id="eiwitten"
                    name="eiwitten"
                    value={formData.eiwitten}
                    onChange={handleInputChange}
                    className={errors.eiwitten ? 'error' : ''}
                    placeholder="12"
                    min="0"
                    step="0.1"
                  />
                  {errors.eiwitten && <span className="error-text">{errors.eiwitten}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="koolhydraten">Koolhydraten (g)</label>
                  <input
                    type="number"
                    id="koolhydraten"
                    name="koolhydraten"
                    value={formData.koolhydraten}
                    onChange={handleInputChange}
                    className={errors.koolhydraten ? 'error' : ''}
                    placeholder="45"
                    min="0"
                    step="0.1"
                  />
                  {errors.koolhydraten && <span className="error-text">{errors.koolhydraten}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="vetten">Vetten (g)</label>
                  <input
                    type="number"
                    id="vetten"
                    name="vetten"
                    value={formData.vetten}
                    onChange={handleInputChange}
                    className={errors.vetten ? 'error' : ''}
                    placeholder="8"
                    min="0"
                    step="0.1"
                  />
                  {errors.vetten && <span className="error-text">{errors.vetten}</span>}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                🥗 Maaltijd Toevoegen
              </button>
            </form>
          </div>
        )}

        <div className="today-summary">
          <h2>Vandaag</h2>
          <div className="nutrition-stats">
            <div className="stat-box">
              <span className="stat-number">{todayStats.calorieën}</span>
              <span className="stat-label">Calorieën</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{todayStats.eiwitten.toFixed(1)}g</span>
              <span className="stat-label">Eiwitten</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{todayStats.koolhydraten.toFixed(1)}g</span>
              <span className="stat-label">Koolhydraten</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{todayStats.vetten.toFixed(1)}g</span>
              <span className="stat-label">Vetten</span>
            </div>
          </div>
        </div>

        <div className="nutrition-filters">
          <div className="filter-group">
            <label htmlFor="dateFilter">Filter op datum:</label>
            <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="date-filter"
            />
          </div>

          {dateFilter && (
            <button 
              className="clear-filter-btn"
              onClick={() => setDateFilter('')}
            >
              🗑️ Alle datums tonen
            </button>
          )}
        </div>

        {dateFilter && dateFilter !== today && (
          <div className="filtered-summary">
            <h3>Totaal voor {new Date(dateFilter).toLocaleDateString('nl-NL')}</h3>
            <div className="nutrition-stats">
              <div className="stat-box">
                <span className="stat-number">{filteredStats.calorieën}</span>
                <span className="stat-label">Calorieën</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{filteredStats.eiwitten.toFixed(1)}g</span>
                <span className="stat-label">Eiwitten</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{filteredStats.koolhydraten.toFixed(1)}g</span>
                <span className="stat-label">Koolhydraten</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{filteredStats.vetten.toFixed(1)}g</span>
                <span className="stat-label">Vetten</span>
              </div>
            </div>
          </div>
        )}

        <div className="meals-list">
          <h2>
            {dateFilter 
              ? `Maaltijden van ${new Date(dateFilter).toLocaleDateString('nl-NL')}`
              : 'Alle Maaltijden'
            }
          </h2>
          
          {filteredMeals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🥗</div>
              <h3>
                {meals.length === 0 
                  ? 'Nog geen maaltijden toegevoegd' 
                  : 'Geen maaltijden gevonden voor deze datum'
                }
              </h3>
              <p>
                {meals.length === 0 
                  ? 'Begin met het toevoegen van je eerste maaltijd!' 
                  : 'Probeer een andere datum te selecteren.'
                }
              </p>
            </div>
          ) : (
            <div className="meal-cards">
              {filteredMeals.map((meal) => (
                <div key={meal.id} className="meal-card">
                  <div className="meal-card-header">
                    <h3>{meal.naam}</h3>
                    <div className="meal-time">
                      <span className="time">{meal.tijd}</span>
                      <span className="date">{new Date(meal.datum).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </div>
                  
                  <div className="meal-nutrition">
                    <div className="nutrition-item">
                      <span className="nutrition-icon">🔥</span>
                      <span className="nutrition-value">{meal.calorieën} cal</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-icon">🥩</span>
                      <span className="nutrition-value">{meal.eiwitten}g eiwitten</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-icon">🍞</span>
                      <span className="nutrition-value">{meal.koolhydraten}g koolhydraten</span>
                    </div>
                    <div className="nutrition-item">
                      <span className="nutrition-icon">🥑</span>
                      <span className="nutrition-value">{meal.vetten}g vetten</span>
                    </div>
                  </div>

                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(meal.id)}
                    title="Maaltijd verwijderen"
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

export default NutritionTracker;