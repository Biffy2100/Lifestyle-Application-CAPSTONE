import AsyncStorage from '@react-native-async-storage/async-storage';

// Habit data structure based on your research (Habit Loop + B=MAT model)
export const createHabit = (name, description, cue, reward, difficulty = 1) => {
  return {
    id: Date.now().toString(),
    name,
    description,
    cue, // Trigger for the habit
    reward, // What user gets from completing it
    difficulty, // 1-5 scale for B=MAT model
    createdAt: new Date().toISOString(),
    completions: [], // Array of completion timestamps
    streakData: {
      current: 0,
      longest: 0,
      flexibleScore: 0 // AI-powered scoring instead of rigid streaks
    },
    behaviorData: {
      completionTimes: [], // For pattern recognition
      effortRatings: [], // User-reported effort levels
      moodRatings: [], // Mood when completing
      contextData: [] // Environmental factors
    }
  };
};

// Storage functions
export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem('habits', JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const loadHabits = async () => {
  try {
    const habits = await AsyncStorage.getItem('habits');
    return habits ? JSON.parse(habits) : [];
  } catch (error) {
    console.error('Error loading habits:', error);
    return [];
  }
};

// Complete a habit (collecting behavioral data)
export const completeHabit = (habit, effortRating, moodRating) => {
  const completion = {
    timestamp: new Date().toISOString(),
    effortRating, // 1-5 how hard it was
    moodRating, // 1-5 mood level
    dayOfWeek: new Date().getDay(),
    hourOfDay: new Date().getHours()
  };
  
  return {
    ...habit,
    completions: [...habit.completions, completion],
    behaviorData: {
      ...habit.behaviorData,
      completionTimes: [...habit.behaviorData.completionTimes, completion.timestamp],
      effortRatings: [...habit.behaviorData.effortRatings, effortRating],
      moodRatings: [...habit.behaviorData.moodRatings, moodRating]
    }
  };
};
