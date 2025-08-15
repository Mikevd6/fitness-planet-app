// LocalStorage utility functions for data persistence

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Initialize default data structure
export const initializeData = () => {
  if (!getFromStorage('workouts')) {
    saveToStorage('workouts', []);
  }
  
  if (!getFromStorage('nutrition')) {
    saveToStorage('nutrition', []);
  }
  
  if (!getFromStorage('progress')) {
    saveToStorage('progress', []);
  }
  
  if (!getFromStorage('userProfile')) {
    saveToStorage('userProfile', {
      naam: '',
      leeftijd: '',
      lengte: '',
      doelgewicht: '',
      notificaties: true
    });
  }
};