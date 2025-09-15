import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const authActionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case authActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case authActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case authActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case authActionTypes.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user
      };
    
    case authActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case authActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: authActionTypes.SET_LOADING, payload: true });
      
      const isAuth = await authAPI.isAuthenticated();
      if (isAuth) {
        const userData = await authAPI.getStoredUserData();
        if (userData) {
          dispatch({ 
            type: authActionTypes.LOGIN_SUCCESS, 
            payload: { user: userData } 
          });
        } else {
          dispatch({ type: authActionTypes.LOGOUT });
        }
      } else {
        dispatch({ type: authActionTypes.LOGOUT });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: authActionTypes.LOGOUT });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: authActionTypes.SET_LOADING, payload: true });
      dispatch({ type: authActionTypes.CLEAR_ERROR });

      const result = await authAPI.login(credentials);
      
      if (result.success) {
        dispatch({ 
          type: authActionTypes.LOGIN_SUCCESS, 
          payload: { user: result.data.user } 
        });
        return { success: true };
      } else {
        dispatch({ 
          type: authActionTypes.SET_ERROR, 
          payload: result.message 
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Login failed. Please try again.';
      dispatch({ type: authActionTypes.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: authActionTypes.SET_LOADING, payload: true });
      dispatch({ type: authActionTypes.CLEAR_ERROR });

      const result = await authAPI.signup(userData);
      
      if (result.success) {
        dispatch({ 
          type: authActionTypes.LOGIN_SUCCESS, 
          payload: { user: result.data.user } 
        });
        return { success: true };
      } else {
        dispatch({ 
          type: authActionTypes.SET_ERROR, 
          payload: result.message 
        });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Signup failed. Please try again.';
      dispatch({ type: authActionTypes.SET_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      dispatch({ type: authActionTypes.LOGOUT });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      dispatch({ type: authActionTypes.LOGOUT });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const result = await authAPI.updateProfile(profileData);
      
      if (result.success) {
        dispatch({ 
          type: authActionTypes.UPDATE_USER, 
          payload: { user: result.data.user } 
        });
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Profile update failed' };
    }
  };

  const clearError = () => {
    dispatch({ type: authActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { authActionTypes };
export default AuthContext;