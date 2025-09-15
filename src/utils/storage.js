import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class PlatformStorage {
  // Get item from storage
  static async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  // Set item in storage
  static async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  }

  // Remove item from storage
  static async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }

  // Clear all storage
  static async clear() {
    try {
      if (Platform.OS === 'web') {
        localStorage.clear();
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  // Get multiple items
  static async multiGet(keys) {
    try {
      if (Platform.OS === 'web') {
        return keys.map(key => [key, localStorage.getItem(key)]);
      } else {
        return await AsyncStorage.multiGet(keys);
      }
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return [];
    }
  }

  // Set multiple items
  static async multiSet(keyValuePairs) {
    try {
      if (Platform.OS === 'web') {
        keyValuePairs.forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
      } else {
        await AsyncStorage.multiSet(keyValuePairs);
      }
    } catch (error) {
      console.error('Storage multiSet error:', error);
    }
  }

  // Remove multiple items
  static async multiRemove(keys) {
    try {
      if (Platform.OS === 'web') {
        keys.forEach(key => {
          localStorage.removeItem(key);
        });
      } else {
        await AsyncStorage.multiRemove(keys);
      }
    } catch (error) {
      console.error('Storage multiRemove error:', error);
    }
  }
}

// Helper functions for common storage operations
export const storage = {
  // Save object as JSON string
  async setObject(key, object) {
    try {
      const jsonString = JSON.stringify(object);
      await PlatformStorage.setItem(key, jsonString);
    } catch (error) {
      console.error('Storage setObject error:', error);
    }
  },

  // Get object from JSON string
  async getObject(key) {
    try {
      const jsonString = await PlatformStorage.getItem(key);
      return jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error('Storage getObject error:', error);
      return null;
    }
  },

  // Storage keys
  keys: {
    AUTH_TOKEN: '@auth_token',
    USER_DATA: '@user_data',
    HABITS_DATA: '@habits_data',
    USER_NAME: '@user_name',
    USER_EMAIL: '@user_email',
    USER_JOIN_DATE: '@user_join_date',
    USER_AUTHENTICATED: '@user_authenticated',
    USER_LOGIN_TIME: '@user_login_time',
    APP_SETTINGS: '@app_settings'
  }
};

export default PlatformStorage;