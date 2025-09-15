import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use different storage based on platform
const getStorageItem = async (key) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
};

const setStorageItem = async (key, value) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

const removeStorageItem = async (key) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

// API Configuration
const API_BASE_URL = __DEV__ 
  ? (Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000')
  : 'https://your-backend-url.onrender.com'; // Replace with your production backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getStorageItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token
      await removeStorageItem('@auth_token');
      await removeStorageItem('@user_data');
      
      // You might want to redirect to login here
      // or emit an event to update app state
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  signup: async (userData) => {
    try {
      const response = await api.post('/api/users/signup', userData);
      const { token, user } = response.data;
      
      // Store token and user data
      await setStorageItem('@auth_token', token);
      await setStorageItem('@user_data', JSON.stringify(user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/api/users/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      await setStorageItem('@auth_token', token);
      await setStorageItem('@user_data', JSON.stringify(user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/me');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/users/profile', profileData);
      
      // Update stored user data
      await setStorageItem('@user_data', JSON.stringify(response.data.user));
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await removeStorageItem('@auth_token');
      await removeStorageItem('@user_data');
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Logout failed' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await getStorageItem('@auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get stored user data
  getStoredUserData: async () => {
    try {
      const userData = await getStorageItem('@user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }
};

// Habits API functions
export const habitsAPI = {
  // Get all habits
  getHabits: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/api/habits?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch habits'
      };
    }
  },

  // Create new habit
  createHabit: async (habitData) => {
    try {
      const response = await api.post('/api/habits', habitData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create habit'
      };
    }
  },

  // Update habit
  updateHabit: async (habitId, habitData) => {
    try {
      const response = await api.put(`/api/habits/${habitId}`, habitData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update habit'
      };
    }
  },

  // Delete habit
  deleteHabit: async (habitId) => {
    try {
      const response = await api.delete(`/api/habits/${habitId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete habit'
      };
    }
  },

  // Toggle habit completion
  toggleHabitCompletion: async (habitId) => {
    try {
      const response = await api.patch(`/api/habits/${habitId}/toggle`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle habit'
      };
    }
  },

  // Get habit statistics
  getHabitStats: async () => {
    try {
      const response = await api.get('/api/habits/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get statistics'
      };
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: 'Backend server is not available'
    };
  }
};

export { getStorageItem, setStorageItem, removeStorageItem };
export default api;