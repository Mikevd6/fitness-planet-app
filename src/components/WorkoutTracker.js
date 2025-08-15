import React, { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import '../styles/WorkoutTracker.css';

function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [newWorkout, setNewWorkout] = useState({
    naam: '',
    duur: '',
    type: '',
    calories: ''
  });

  useEffect(() => {
    const savedWorkouts = getFromStorage('workouts') || [];
    setWorkouts(savedWorkouts);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newWorkout.naam || !newWorkout.duur || !newWorkout.type) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const workout = {
      id: Date.now(),
      ...newWorkout,
      duur: parseInt(newWorkout.duur),
      calories: parseInt(newWorkout.calories) || 0,
      date: new Date().toISOString()
    };

    const updatedWorkouts = [workout, ...workouts];
    setWorkouts(updatedWorkouts);
    saveToStorage('workouts', updatedWorkouts);

    // Reset form
    setNewWorkout({
      naam: '',
      duur: '',
      type: '',
      calories: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Weet je zeker dat je deze workout wilt verwijderen?')) {
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      setWorkouts(updatedWorkouts);
      saveToStorage('workouts', updatedWorkouts);
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || workout.type === filterType;
    return matchesSearch && matchesType;
  });

  const workoutTypes = [...new Set(workouts.map(w => w.type))];

  return (
    <div className="workout-tracker">
      <div className="workout-header">
        <h1>💪 Workout Tracker</h1>
        <button 
          className="add-workout-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuleren' : 'Nieuwe Workout'}
        </button>
      </div>

      {showForm && (
        <div className="workout-form-container">
          <form onSubmit={handleSubmit} className="workout-form">
            <h2>Nieuwe Workout Toevoegen</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="naam">Workout Naam *</label>
                <input
                  type="text"
                  id="naam"
                  value={newWorkout.naam}
                  onChange={(e) => setNewWorkout({...newWorkout, naam: e.target.value})}
                  placeholder="Bijv. Ochtend Run"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="duur">Duur (minuten) *</label>
                <input
                  type="number"
                  id="duur"
                  value={newWorkout.duur}
                  onChange={(e) => setNewWorkout({...newWorkout, duur: e.target.value})}
                  placeholder="60"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Type *</label>
                <select
                  id="type"
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                  required
                >
                  <option value="">Selecteer type</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Kracht">Kracht</option>
                  <option value="Yoga">Yoga</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Zwemmen">Zwemmen</option>
                  <option value="Fietsen">Fietsen</option>
                  <option value="Hardlopen">Hardlopen</option>
                  <option value="Anders">Anders</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="calories">Calorieën Verbrand</label>
                <input
                  type="number"
                  id="calories"
                  value={newWorkout.calories}
                  onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                  placeholder="300"
                  min="0"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Workout Opslaan
            </button>
          </form>
        </div>
      )}

      <div className="workout-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Zoek workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">Alle types</option>
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="workouts-list">
        {filteredWorkouts.length === 0 ? (
          <div className="empty-state">
            <p>Geen workouts gevonden. Voeg je eerste workout toe!</p>
          </div>
        ) : (
          filteredWorkouts.map(workout => (
            <div key={workout.id} className="workout-card">
              <div className="workout-info">
                <h3>{workout.naam}</h3>
                <div className="workout-details">
                  <span className="workout-type">{workout.type}</span>
                  <span className="workout-duration">{workout.duur} min</span>
                  <span className="workout-calories">{workout.calories} cal</span>
                  <span className="workout-date">
                    {new Date(workout.date).toLocaleDateString('nl-NL')}
                  </span>
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(workout.id)}
                title="Verwijder workout"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {workouts.length > 0 && (
        <div className="workout-stats">
          <h3>Statistieken</h3>
          <div className="stats-row">
            <div className="stat">
              <strong>Totaal workouts:</strong> {workouts.length}
            </div>
            <div className="stat">
              <strong>Totaal minuten:</strong> {workouts.reduce((total, w) => total + w.duur, 0)}
            </div>
            <div className="stat">
              <strong>Totaal calorieën:</strong> {workouts.reduce((total, w) => total + w.calories, 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutTracker;