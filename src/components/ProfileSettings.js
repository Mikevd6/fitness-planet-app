import React, { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import '../styles/ProfileSettings.css';

function ProfileSettings({ currentUser, setCurrentUser }) {
  const [profile, setProfile] = useState({
    naam: '',
    leeftijd: '',
    lengte: '',
    doelgewicht: '',
    geslacht: '',
    activiteitsniveau: '',
    doelType: ''
  });

  const [settings, setSettings] = useState({
    notificaties: true,
    donkereThema: false,
    emailMeldingen: false,
    weekelijkeRapporten: true
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = getFromStorage('userProfile') || {};
    const savedSettings = getFromStorage('userSettings') || {
      notificaties: true,
      donkereThema: false,
      emailMeldingen: false,
      weekelijkeRapporten: true
    };

    setProfile({
      naam: savedProfile.naam || currentUser?.username || '',
      leeftijd: savedProfile.leeftijd || '',
      lengte: savedProfile.lengte || '',
      doelgewicht: savedProfile.doelgewicht || '',
      geslacht: savedProfile.geslacht || '',
      activiteitsniveau: savedProfile.activiteitsniveau || '',
      doelType: savedProfile.doelType || ''
    });

    setSettings(savedSettings);
  }, [currentUser]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // Save profile to localStorage
    saveToStorage('userProfile', profile);
    
    // Update current user if name changed
    if (profile.naam !== currentUser?.username) {
      const updatedUser = { ...currentUser, username: profile.naam };
      setCurrentUser(updatedUser);
      saveToStorage('currentUser', updatedUser);
    }

    setIsEditing(false);
    alert('Profiel succesvol opgeslagen!');
  };

  const handleSettingsChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    saveToStorage('userSettings', newSettings);
  };

  const calculateBMR = () => {
    if (!profile.leeftijd || !profile.lengte || !profile.doelgewicht || !profile.geslacht) {
      return null;
    }

    const age = parseInt(profile.leeftijd);
    const height = parseInt(profile.lengte);
    const weight = parseFloat(profile.doelgewicht);

    // Mifflin-St Jeor Equation
    let bmr;
    if (profile.geslacht === 'man') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Adjust for activity level
    const activityMultipliers = {
      'sedentair': 1.2,
      'licht': 1.375,
      'matig': 1.55,
      'actief': 1.725,
      'zeer-actief': 1.9
    };

    const multiplier = activityMultipliers[profile.activiteitsniveau] || 1.2;
    return Math.round(bmr * multiplier);
  };

  const bmr = calculateBMR();

  return (
    <div className="profile-settings">
      <div className="profile-header">
        <h1>⚙️ Profiel & Instellingen</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>Persoonlijke Informatie</h2>
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Annuleren' : 'Bewerken'}
            </button>
          </div>

          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="naam">Naam</label>
                <input
                  type="text"
                  id="naam"
                  value={profile.naam}
                  onChange={(e) => setProfile({...profile, naam: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Je volledige naam"
                />
              </div>

              <div className="form-group">
                <label htmlFor="leeftijd">Leeftijd</label>
                <input
                  type="number"
                  id="leeftijd"
                  value={profile.leeftijd}
                  onChange={(e) => setProfile({...profile, leeftijd: e.target.value})}
                  disabled={!isEditing}
                  placeholder="25"
                  min="13"
                  max="100"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="geslacht">Geslacht</label>
                <select
                  id="geslacht"
                  value={profile.geslacht}
                  onChange={(e) => setProfile({...profile, geslacht: e.target.value})}
                  disabled={!isEditing}
                >
                  <option value="">Selecteer</option>
                  <option value="man">Man</option>
                  <option value="vrouw">Vrouw</option>
                  <option value="anders">Anders</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="lengte">Lengte (cm)</label>
                <input
                  type="number"
                  id="lengte"
                  value={profile.lengte}
                  onChange={(e) => setProfile({...profile, lengte: e.target.value})}
                  disabled={!isEditing}
                  placeholder="175"
                  min="120"
                  max="250"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="doelgewicht">Doel Gewicht (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  id="doelgewicht"
                  value={profile.doelgewicht}
                  onChange={(e) => setProfile({...profile, doelgewicht: e.target.value})}
                  disabled={!isEditing}
                  placeholder="70"
                  min="40"
                  max="200"
                />
              </div>

              <div className="form-group">
                <label htmlFor="doelType">Doel Type</label>
                <select
                  id="doelType"
                  value={profile.doelType}
                  onChange={(e) => setProfile({...profile, doelType: e.target.value})}
                  disabled={!isEditing}
                >
                  <option value="">Selecteer doel</option>
                  <option value="afvallen">Afvallen</option>
                  <option value="aankomen">Aankomen</option>
                  <option value="onderhouden">Gewicht onderhouden</option>
                  <option value="spiermassa">Spiermassa opbouwen</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="activiteitsniveau">Activiteitsniveau</label>
              <select
                id="activiteitsniveau"
                value={profile.activiteitsniveau}
                onChange={(e) => setProfile({...profile, activiteitsniveau: e.target.value})}
                disabled={!isEditing}
              >
                <option value="">Selecteer activiteitsniveau</option>
                <option value="sedentair">Sedentair (weinig tot geen beweging)</option>
                <option value="licht">Licht actief (1-3 dagen per week)</option>
                <option value="matig">Matig actief (3-5 dagen per week)</option>
                <option value="actief">Actief (6-7 dagen per week)</option>
                <option value="zeer-actief">Zeer actief (2x per dag of intense training)</option>
              </select>
            </div>

            {isEditing && (
              <button type="submit" className="save-profile-btn">
                Profiel Opslaan
              </button>
            )}
          </form>
        </div>

        {bmr && (
          <div className="bmr-section">
            <h3>Aanbevolen Dagelijkse Calorie-inname</h3>
            <div className="bmr-card">
              <div className="bmr-value">{bmr} calorieën</div>
              <p>Gebaseerd op je profiel en activiteitsniveau</p>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h2>App Instellingen</h2>
          
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Notificaties</h3>
                <p>Ontvang herinneringen voor workouts en voeding</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.notificaties}
                  onChange={(e) => handleSettingsChange('notificaties', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Donkere Thema</h3>
                <p>Gebruik donkere kleuren voor de app</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.donkereThema}
                  onChange={(e) => handleSettingsChange('donkereThema', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Meldingen</h3>
                <p>Ontvang updates via email</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.emailMeldingen}
                  onChange={(e) => handleSettingsChange('emailMeldingen', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Wekelijkse Rapporten</h3>
                <p>Ontvang een samenvatting van je voortgang</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.weekelijkeRapporten}
                  onChange={(e) => handleSettingsChange('weekelijkeRapporten', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="account-section">
          <h2>Account Informatie</h2>
          
          <div className="account-info">
            <div className="info-item">
              <strong>Gebruikersnaam:</strong> {currentUser?.username}
            </div>
            <div className="info-item">
              <strong>Aangemeld sinds:</strong> {
                currentUser?.loginTime ? 
                new Date(currentUser.loginTime).toLocaleDateString('nl-NL') : 
                'Onbekend'
              }
            </div>
            <div className="info-item">
              <strong>App versie:</strong> 1.0.0
            </div>
          </div>

          <div className="account-actions">
            <button className="danger-btn" onClick={() => {
              if (window.confirm('Weet je zeker dat je alle data wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}>
              Alle Data Wissen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;