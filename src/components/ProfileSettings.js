import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import '../styles/ProfileSettings.css';

const ProfileSettings = ({ user }) => {
  const [profile, setProfile] = useState({
    naam: '',
    leeftijd: '',
    lengte: '',
    doelgewicht: '',
    notificaties: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const savedProfile = storage.getProfile();
    setProfile(savedProfile);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!profile.naam.trim()) {
      newErrors.naam = 'Naam is verplicht';
    }

    if (profile.leeftijd && (profile.leeftijd < 13 || profile.leeftijd > 120)) {
      newErrors.leeftijd = 'Leeftijd moet tussen 13 en 120 jaar zijn';
    }

    if (profile.lengte && (profile.lengte < 100 || profile.lengte > 250)) {
      newErrors.lengte = 'Lengte moet tussen 100 en 250 cm zijn';
    }

    if (profile.doelgewicht && (profile.doelgewicht < 30 || profile.doelgewicht > 300)) {
      newErrors.doelgewicht = 'Doelgewicht moet tussen 30 en 300 kg zijn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    storage.setProfile(profile);
    setIsEditing(false);
    setSaveMessage('Profiel succesvol opgeslagen! ✅');
    
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    loadProfile(); // Reset to saved data
    setIsEditing(false);
    setErrors({});
  };

  const calculateBMI = () => {
    if (!profile.lengte) return null;
    
    const progress = storage.getProgress();
    if (progress.length === 0) return null;

    const currentWeight = progress[0].gewicht;
    const heightInM = profile.lengte / 100;
    const bmi = currentWeight / (heightInM * heightInM);

    return bmi.toFixed(1);
  };

  const getAccountStats = () => {
    const workouts = storage.getWorkouts();
    const nutrition = storage.getNutrition();
    const progress = storage.getProgress();

    return {
      totalWorkouts: workouts.length,
      totalMeals: nutrition.length,
      weightEntries: progress.length,
      memberSince: user?.loginTime ? new Date(user.loginTime).toLocaleDateString('nl-NL') : 'Onbekend'
    };
  };

  const stats = getAccountStats();
  const currentBMI = calculateBMI();

  return (
    <div className="profile-settings">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profiel Instellingen</h1>
          {!isEditing && (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Bewerken
            </button>
          )}
        </div>

        {saveMessage && (
          <div className="save-message">
            {saveMessage}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-form-section">
            <form className="profile-form" onSubmit={handleSubmit}>
              <h2>Persoonlijke Gegevens</h2>

              <div className="form-group">
                <label htmlFor="naam">Volledige Naam</label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  value={profile.naam}
                  onChange={handleInputChange}
                  className={errors.naam ? 'error' : ''}
                  placeholder="Voer je volledige naam in"
                  disabled={!isEditing}
                />
                {errors.naam && <span className="error-text">{errors.naam}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="leeftijd">Leeftijd</label>
                  <input
                    type="number"
                    id="leeftijd"
                    name="leeftijd"
                    value={profile.leeftijd}
                    onChange={handleInputChange}
                    className={errors.leeftijd ? 'error' : ''}
                    placeholder="25"
                    min="13"
                    max="120"
                    disabled={!isEditing}
                  />
                  {errors.leeftijd && <span className="error-text">{errors.leeftijd}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lengte">Lengte (cm)</label>
                  <input
                    type="number"
                    id="lengte"
                    name="lengte"
                    value={profile.lengte}
                    onChange={handleInputChange}
                    className={errors.lengte ? 'error' : ''}
                    placeholder="175"
                    min="100"
                    max="250"
                    disabled={!isEditing}
                  />
                  {errors.lengte && <span className="error-text">{errors.lengte}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="doelgewicht">Doelgewicht (kg)</label>
                <input
                  type="number"
                  id="doelgewicht"
                  name="doelgewicht"
                  value={profile.doelgewicht}
                  onChange={handleInputChange}
                  className={errors.doelgewicht ? 'error' : ''}
                  placeholder="70"
                  min="30"
                  max="300"
                  step="0.1"
                  disabled={!isEditing}
                />
                {errors.doelgewicht && <span className="error-text">{errors.doelgewicht}</span>}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="notificaties"
                    checked={profile.notificaties}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <span className="checkmark"></span>
                  Notificaties ontvangen voor doelen en reminders
                </label>
              </div>

              {isEditing && (
                <div className="form-buttons">
                  <button type="submit" className="save-btn">
                    💾 Opslaan
                  </button>
                  <button type="button" className="cancel-btn" onClick={handleCancel}>
                    ❌ Annuleren
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="profile-stats-section">
            <div className="stats-card">
              <h2>Profiel Overzicht</h2>
              
              <div className="stat-item">
                <span className="stat-icon">👤</span>
                <div className="stat-info">
                  <span className="stat-label">Gebruikersnaam</span>
                  <span className="stat-value">{user?.username || 'Niet ingesteld'}</span>
                </div>
              </div>

              {profile.leeftijd && (
                <div className="stat-item">
                  <span className="stat-icon">🎂</span>
                  <div className="stat-info">
                    <span className="stat-label">Leeftijd</span>
                    <span className="stat-value">{profile.leeftijd} jaar</span>
                  </div>
                </div>
              )}

              {profile.lengte && (
                <div className="stat-item">
                  <span className="stat-icon">📏</span>
                  <div className="stat-info">
                    <span className="stat-label">Lengte</span>
                    <span className="stat-value">{profile.lengte} cm</span>
                  </div>
                </div>
              )}

              {currentBMI && (
                <div className="stat-item">
                  <span className="stat-icon">⚖️</span>
                  <div className="stat-info">
                    <span className="stat-label">Huidige BMI</span>
                    <span className="stat-value">{currentBMI}</span>
                  </div>
                </div>
              )}

              {profile.doelgewicht && (
                <div className="stat-item">
                  <span className="stat-icon">🎯</span>
                  <div className="stat-info">
                    <span className="stat-label">Doelgewicht</span>
                    <span className="stat-value">{profile.doelgewicht} kg</span>
                  </div>
                </div>
              )}

              <div className="stat-item">
                <span className="stat-icon">🔔</span>
                <div className="stat-info">
                  <span className="stat-label">Notificaties</span>
                  <span className="stat-value">
                    {profile.notificaties ? 'Ingeschakeld' : 'Uitgeschakeld'}
                  </span>
                </div>
              </div>
            </div>

            <div className="activity-stats-card">
              <h2>Activiteit Statistieken</h2>
              
              <div className="activity-grid">
                <div className="activity-item">
                  <span className="activity-number">{stats.totalWorkouts}</span>
                  <span className="activity-label">Workouts</span>
                  <span className="activity-icon">💪</span>
                </div>

                <div className="activity-item">
                  <span className="activity-number">{stats.totalMeals}</span>
                  <span className="activity-label">Maaltijden</span>
                  <span className="activity-icon">🥗</span>
                </div>

                <div className="activity-item">
                  <span className="activity-number">{stats.weightEntries}</span>
                  <span className="activity-label">Gewichtsmetingen</span>
                  <span className="activity-icon">📊</span>
                </div>
              </div>

              <div className="member-since">
                <span className="member-icon">📅</span>
                <span>Lid sinds: {stats.memberSince}</span>
              </div>
            </div>

            <div className="quick-actions-card">
              <h2>Snelle Acties</h2>
              
              <div className="quick-action-buttons">
                <button className="quick-action-btn" onClick={() => window.location.href = '/workouts'}>
                  💪 Nieuwe Workout
                </button>
                <button className="quick-action-btn" onClick={() => window.location.href = '/voeding'}>
                  🥗 Maaltijd Toevoegen
                </button>
                <button className="quick-action-btn" onClick={() => window.location.href = '/voortgang'}>
                  ⚖️ Gewicht Bijwerken
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-footer">
          <div className="app-info">
            <h3>Over Fitness Planet</h3>
            <p>
              Fitness Planet helpt je bij het bijhouden van je fitnessreis. 
              Track je workouts, voeding en voortgang allemaal op één plek.
            </p>
            <div className="app-features">
              <span className="feature">🎯 Doelen bijhouden</span>
              <span className="feature">📊 Voortgang visualiseren</span>
              <span className="feature">📱 Mobiel vriendelijk</span>
              <span className="feature">💾 Lokale gegevensopslag</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;