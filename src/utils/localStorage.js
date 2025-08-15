// localStorage utility functions for Fitness Planet app

export const storage = {
  // User authentication
  setUser: (user) => {
    localStorage.setItem('fitnessUser', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('fitnessUser');
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('fitnessUser');
  },
  
  // User profile
  setProfile: (profile) => {
    localStorage.setItem('fitnessProfile', JSON.stringify(profile));
  },
  
  getProfile: () => {
    const profile = localStorage.getItem('fitnessProfile');
    return profile ? JSON.parse(profile) : {
      naam: '',
      leeftijd: '',
      lengte: '',
      doelgewicht: '',
      notificaties: true
    };
  },
  
  // Workouts
  getWorkouts: () => {
    const workouts = localStorage.getItem('fitnessWorkouts');
    return workouts ? JSON.parse(workouts) : [];
  },
  
  addWorkout: (workout) => {
    const workouts = storage.getWorkouts();
    const newWorkout = {
      id: Date.now(),
      datum: new Date().toISOString().split('T')[0],
      ...workout
    };
    workouts.unshift(newWorkout);
    localStorage.setItem('fitnessWorkouts', JSON.stringify(workouts));
    return newWorkout;
  },
  
  deleteWorkout: (id) => {
    const workouts = storage.getWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem('fitnessWorkouts', JSON.stringify(filtered));
  },
  
  // Nutrition
  getNutrition: () => {
    const nutrition = localStorage.getItem('fitnessNutrition');
    return nutrition ? JSON.parse(nutrition) : [];
  },
  
  addMeal: (meal) => {
    const meals = storage.getNutrition();
    const newMeal = {
      id: Date.now(),
      datum: new Date().toISOString().split('T')[0],
      tijd: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
      ...meal
    };
    meals.unshift(newMeal);
    localStorage.setItem('fitnessNutrition', JSON.stringify(meals));
    return newMeal;
  },
  
  deleteMeal: (id) => {
    const meals = storage.getNutrition();
    const filtered = meals.filter(m => m.id !== id);
    localStorage.setItem('fitnessNutrition', JSON.stringify(filtered));
  },
  
  // Progress
  getProgress: () => {
    const progress = localStorage.getItem('fitnessProgress');
    return progress ? JSON.parse(progress) : [];
  },
  
  addWeight: (weight) => {
    const progress = storage.getProgress();
    const newEntry = {
      id: Date.now(),
      datum: new Date().toISOString().split('T')[0],
      gewicht: parseFloat(weight)
    };
    progress.unshift(newEntry);
    localStorage.setItem('fitnessProgress', JSON.stringify(progress));
    return newEntry;
  },
  
  deleteWeight: (id) => {
    const progress = storage.getProgress();
    const filtered = progress.filter(p => p.id !== id);
    localStorage.setItem('fitnessProgress', JSON.stringify(filtered));
  },
  
  // Goals
  getGoals: () => {
    const goals = localStorage.getItem('fitnessGoals');
    return goals ? JSON.parse(goals) : {
      weeklyWorkouts: 3,
      dailyCalories: 2000,
      targetWeight: 70
    };
  },
  
  setGoals: (goals) => {
    localStorage.setItem('fitnessGoals', JSON.stringify(goals));
  }
};