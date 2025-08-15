import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import '../styles/WorkoutTracker.css';

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [formData, setFormData] = useState({
    naam: '',
    duur: '',
    type: '',
    calorieën: ''
  });
  const [errors, setErrors] = useState({});

  const workoutTypes = [
    'Cardio',
    'Krachttraining',
    'Yoga',
    'Pilates',
    'HIIT',
    'Zwemmen',
    'Hardlopen',
    'Fietsen',
    'Crossfit',
    'Dans',
    'Boksen',
    'Stretching'
  ];

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workouts, searchTerm, typeFilter]);

  const loadWorkouts = () => {
    const savedWorkouts = storage.getWorkouts();
    setWorkouts(savedWorkouts);
  };

  const filterWorkouts = () => {
    let filtered = workouts;

    if (searchTerm) {
      filtered = filtered.filter(workout =>
        workout.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(workout => workout.type === typeFilter);
    }

    setFilteredWorkouts(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
      newErrors.naam = 'Workout naam is verplicht';
    }

    if (!formData.duur || formData.duur <= 0) {
      newErrors.duur = 'Duur moet groter zijn dan 0';
    }

    if (!formData.type) {
      newErrors.type = 'Selecteer een workout type';
    }

    if (!formData.calorieën || formData.calorieën <= 0) {
      newErrors.calorieën = 'Calorieën moet groter zijn dan 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    storage.addWorkout({
      naam: formData.naam.trim(),
      duur: parseInt(formData.duur),
      type: formData.type,
      calorieën: parseInt(formData.calorieën)
    });

    loadWorkouts();
    
    // Reset form
    setFormData({
      naam: '',
      duur: '',
      type: '',
      calorieën: ''
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Weet je zeker dat je deze workout wilt verwijderen?')) {
      storage.deleteWorkout(id);
      loadWorkouts();
    }
  };

  const getTotalStats = () => {
    const total = filteredWorkouts.reduce((acc, workout) => ({
      duur: acc.duur + workout.duur,
      calorieën: acc.calorieën + workout.calorieën
    }), { duur: 0, calorieën: 0 });

    return total;
  };

  const stats = getTotalStats();

  return (
    <div className="workout-tracker">
      <div className="workout-container">
        <div className="workout-header">
          <h1>Workout Tracker</h1>
          <button 
            className="add-workout-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Annuleren' : '➕ Nieuwe Workout'}
          </button>
        </div>

        {showForm && (
          <div className="workout-form-container">
            <form className="workout-form" onSubmit={handleSubmit}>
              <h2>Nieuwe Workout Toevoegen</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="naam">Workout Naam</label>
                  <input
                    type="text"
                    id="naam"
                    name="naam"
                    value={formData.naam}
                    onChange={handleInputChange}
                    className={errors.naam ? 'error' : ''}
                    placeholder="Bijv. Ochtend cardio"
                  />
                  {errors.naam && <span className="error-text">{errors.naam}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type Workout</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={errors.type ? 'error' : ''}
                  >
                    <option value="">Selecteer type</option>
                    {workoutTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && <span className="error-text">{errors.type}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duur">Duur (minuten)</label>
                  <input
                    type="number"
                    id="duur"
                    name="duur"
                    value={formData.duur}
                    onChange={handleInputChange}
                    className={errors.duur ? 'error' : ''}
                    placeholder="30"
                    min="1"
                  />
                  {errors.duur && <span className="error-text">{errors.duur}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="calorieën">Calorieën Verbrand</label>
                  <input
                    type="number"
                    id="calorieën"
                    name="calorieën"
                    value={formData.calorieën}
                    onChange={handleInputChange}
                    className={errors.calorieën ? 'error' : ''}
                    placeholder="250"
                    min="1"
                  />
                  {errors.calorieën && <span className="error-text">{errors.calorieën}</span>}
                </div>
              </div>

              <button type="submit" className="submit-btn">
                💪 Workout Toevoegen
              </button>
            </form>
          </div>
        )}

        <div className="workout-stats">
          <div className="stat-box">
            <span className="stat-number">{filteredWorkouts.length}</span>
            <span className="stat-label">Workouts</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{stats.duur}</span>
            <span className="stat-label">Minuten</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{stats.calorieën}</span>
            <span className="stat-label">Calorieën</span>
          </div>
        </div>

        <div className="workout-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 Zoek workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Alle types</option>
              {workoutTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {(searchTerm || typeFilter) && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
              }}
            >
              🗑️ Filters wissen
            </button>
          )}
        </div>

        <div className="workouts-list">
          {filteredWorkouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💪</div>
              <h3>
                {workouts.length === 0 
                  ? 'Nog geen workouts toegevoegd' 
                  : 'Geen workouts gevonden'
                }
              </h3>
              <p>
                {workouts.length === 0 
                  ? 'Begin met het toevoegen van je eerste workout!' 
                  : 'Probeer je zoekfilters aan te passen.'
                }
              </p>
            </div>
          ) : (
            <div className="workout-cards">
              {filteredWorkouts.map((workout) => (
                <div key={workout.id} className="workout-card">
                  <div className="workout-card-header">
                    <h3>{workout.naam}</h3>
                    <span className="workout-type">{workout.type}</span>
                  </div>
                  
                  <div className="workout-details">
                    <div className="detail-item">
                      <span className="detail-icon">⏱️</span>
                      <span>{workout.duur} min</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🔥</span>
                      <span>{workout.calorieën} cal</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{new Date(workout.datum).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </div>

                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(workout.id)}
                    title="Workout verwijderen"
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

export default WorkoutTracker;