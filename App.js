import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import screens
import LoginScreen from './src/Screens/LoginScreen';
import HomeScreen from './src/Screens/HomeScreen';
import HabitsScreen from './src/Screens/HabitsScreen';
import ProgressScreen from './src/Screens/ProgressScreen';
import ProfileScreen from './src/Screens/ProfileScreen';
import SettingsScreen from './src/Screens/SettingScreen';

const Tab = createBottomTabNavigator();

// Main app component inside auth provider
function MainApp() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Loading screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" backgroundColor="#f8f9fa" />
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Main app with tabs if authenticated
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Habits':
                iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
                break;
              case 'Progress':
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              case 'Settings':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#95a5a6',
          tabBarStyle: styles.tabBar,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Habits" component={HabitsScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen 
          name="Settings" 
          children={() => <SettingsScreen onLogout={logout} />} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Root app component with providers
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#2c3e50',
    marginTop: 16,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
});
