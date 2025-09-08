import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [userName, setUserName] = useState('User');
  const [todayStats, setTodayStats] = useState({
    completedHabits: 0,
    totalHabits: 0,
    streak: 0,
    weekProgress: 0
  });

  useEffect(() => {
    loadUserData();
    loadTodayStats();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('@user_name');
      if (name) setUserName(name);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadTodayStats = async () => {
    try {
      const habits = await AsyncStorage.getItem('@habits_data');
      if (habits) {
        const parsedHabits = JSON.parse(habits);
        const completed = parsedHabits.filter(h => h.completed).length;
        setTodayStats(prev => ({
          ...prev,
          completedHabits: completed,
          totalHabits: parsedHabits.length,
          streak: Math.floor(Math.random() * 15) + 1, // Demo data
          weekProgress: Math.floor((completed / parsedHabits.length) * 100) || 0
        }));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <Animatable.View animation="fadeInUp" style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </Animatable.View>
  );

  const QuickAction = ({ icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userName}! 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={24} color="#2c3e50" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </Animatable.View>

        {/* Today's Progress */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {todayStats.completedHabits}/{todayStats.totalHabits} Habits
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round((todayStats.completedHabits / todayStats.totalHabits) * 100) || 0}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${(todayStats.completedHabits / todayStats.totalHabits) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </Animatable.View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="flame"
              title="Current Streak"
              value={`${todayStats.streak} days`}
              subtitle="Keep it up!"
              color="#e74c3c"
            />
            <StatCard
              icon="trophy"
              title="This Week"
              value={`${todayStats.weekProgress}%`}
              subtitle="Average completion"
              color="#f39c12"
            />
            <StatCard
              icon="checkmark-circle"
              title="Completed Today"
              value={todayStats.completedHabits}
              subtitle="Great progress!"
              color="#27ae60"
            />
            <StatCard
              icon="trending-up"
              title="Monthly Goal"
              value="85%"
              subtitle="Almost there!"
              color="#9b59b6"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="add-circle"
              title="Add Habit"
              color="#3498db"
              onPress={() => {}}
            />
            <QuickAction
              icon="calendar"
              title="View Calendar"
              color="#e67e22"
              onPress={() => {}}
            />
            <QuickAction
              icon="analytics"
              title="Analytics"
              color="#1abc9c"
              onPress={() => {}}
            />
            <QuickAction
              icon="settings"
              title="Settings"
              color="#95a5a6"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Motivational Quote */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.quoteSection}>
          <Text style={styles.quoteText}>
            "Success is the sum of small efforts, repeated day in and day out."
          </Text>
          <Text style={styles.quoteAuthor}>— Robert Collier</Text>
        </Animatable.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  notificationIcon: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#95a5a6',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 50) / 2,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  quoteSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#3498db',
    borderRadius: 15,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#ecf0f1',
  },
});
