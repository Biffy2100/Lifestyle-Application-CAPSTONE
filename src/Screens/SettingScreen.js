import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminder: true,
    weeklyReport: false,
    soundEffects: true,
    darkMode: false,
    biometricAuth: false,
    autoBackup: true,
  });

  const [reminderTime, setReminderTime] = useState('09:00');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@app_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      const savedReminderTime = await AsyncStorage.getItem('@reminder_time');
      if (savedReminderTime) {
        setReminderTime(savedReminderTime);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('@app_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const exportData = async () => {
    try {
      const habits = await AsyncStorage.getItem('@habits_data');
      const userProfile = await AsyncStorage.getItem('@user_name');
      
      const exportData = {
        habits: habits ? JSON.parse(habits) : [],
        profile: userProfile,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      Alert.alert(
        'Export Data',
        'Your data has been prepared for export. In a real app, this would save to your files or cloud storage.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Share',
            onPress: () => {
              Share.share({
                message: `My Habit Tracker Data - Exported on ${new Date().toLocaleDateString()}`,
                title: 'Habit Tracker Export',
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your habits, progress, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@habits_data',
                '@user_name',
                '@user_email',
                '@app_settings',
                '@reminder_time',
              ]);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const rateApp = () => {
    Alert.alert(
      'Rate Our App',
      'Enjoying the app? Please take a moment to rate us on the App Store!',
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => {
            // In a real app, this would open the App Store
            Alert.alert('Thank you!', 'This would open the App Store in a real app.');
          },
        },
      ]
    );
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing habit tracking app! It has helped me build better habits and stay consistent.',
        title: 'Habit Tracker App',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const contactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Need help? Choose how you\'d like to reach us:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL('mailto:support@habittracker.com?subject=Support Request');
          },
        },
        {
          text: 'FAQ',
          onPress: () => {
            Alert.alert('FAQ', 'This would open the FAQ page in a real app.');
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, color = '#3498db' }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || (
        <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
      )}
    </TouchableOpacity>
  );

  const SwitchSettingItem = ({ icon, title, subtitle, value, onToggle, color = '#3498db' }) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#bdc3c7', true: '#3498db' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );

  const SettingSection = ({ title, children }) => (
    <Animatable.View animation="fadeInUp" style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SwitchSettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive habit reminders and updates"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
            color="#e74c3c"
          />
          <SwitchSettingItem
            icon="alarm"
            title="Daily Reminder"
            subtitle={`Remind me at ${reminderTime}`}
            value={settings.dailyReminder}
            onToggle={() => toggleSetting('dailyReminder')}
            color="#f39c12"
          />
          <SwitchSettingItem
            icon="calendar"
            title="Weekly Report"
            subtitle="Get weekly progress summaries"
            value={settings.weeklyReport}
            onToggle={() => toggleSetting('weeklyReport')}
            color="#9b59b6"
          />
        </SettingSection>

        {/* App Preferences */}
        <SettingSection title="App Preferences">
          <SwitchSettingItem
            icon="volume-high"
            title="Sound Effects"
            subtitle="Play sounds for completion and achievements"
            value={settings.soundEffects}
            onToggle={() => toggleSetting('soundEffects')}
            color="#27ae60"
          />
          <SwitchSettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Use dark theme (coming soon)"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
            color="#2c3e50"
          />
          <SwitchSettingItem
            icon="finger-print"
            title="Biometric Authentication"
            subtitle="Use Face ID or Touch ID to secure app"
            value={settings.biometricAuth}
            onToggle={() => toggleSetting('biometricAuth')}
            color="#1abc9c"
          />
        </SettingSection>

        {/* Data & Privacy */}
        <SettingSection title="Data & Privacy">
          <SwitchSettingItem
            icon="cloud-upload"
            title="Auto Backup"
            subtitle="Automatically backup data to cloud"
            value={settings.autoBackup}
            onToggle={() => toggleSetting('autoBackup')}
            color="#3498db"
          />
          <SettingItem
            icon="download"
            title="Export Data"
            subtitle="Download your habits and progress"
            onPress={exportData}
            color="#95a5a6"
          />
          <SettingItem
            icon="trash"
            title="Clear All Data"
            subtitle="Permanently delete all app data"
            onPress={clearAllData}
            color="#e74c3c"
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support">
          <SettingItem
            icon="star"
            title="Rate the App"
            subtitle="Help us improve with your feedback"
            onPress={rateApp}
            color="#f39c12"
          />
          <SettingItem
            icon="share"
            title="Share with Friends"
            subtitle="Spread the word about habit building"
            onPress={shareApp}
            color="#1abc9c"
          />
          <SettingItem
            icon="help-circle"
            title="Help & Support"
            subtitle="Get help or contact us"
            onPress={contactSupport}
            color="#9b59b6"
          />
          <SettingItem
            icon="document-text"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => Alert.alert('Privacy Policy', 'This would open the privacy policy in a real app.')}
            color="#7f8c8d"
          />
          <SettingItem
            icon="newspaper"
            title="Terms of Service"
            subtitle="Read our terms of service"
            onPress={() => Alert.alert('Terms of Service', 'This would open the terms of service in a real app.')}
            color="#7f8c8d"
          />
        </SettingSection>

        {/* App Info */}
        <SettingSection title="About">
          <View style={styles.appInfo}>
            <Text style={styles.appName}>Lifestyle Habit Tracker</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Build better habits, track your progress, and achieve your goals with our comprehensive habit tracking app.
            </Text>
          </View>
        </SettingSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for better habits
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  settingSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  settingIcon: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  appDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
});
