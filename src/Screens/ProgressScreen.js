import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [habits, setHabits] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('@habits_data');
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        setHabits(parsedHabits);
        generateWeeklyData(parsedHabits);
        generateMonthlyStats(parsedHabits);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const generateWeeklyData = (habits) => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = daysOfWeek.map((day, index) => {
      // Simulate completion data for demo
      const completionRate = Math.random() * 100;
      return {
        day,
        completion: completionRate,
        completed: Math.floor((completionRate / 100) * habits.length),
        total: habits.length,
      };
    });
    setWeeklyData(weekData);
  };

  const generateMonthlyStats = (habits) => {
    const stats = {
      totalHabits: habits.length,
      averageCompletion: 75,
      bestStreak: 12,
      currentStreak: 5,
      totalCompletions: 156,
      missedDays: 8,
    };
    setMonthlyStats(stats);
  };

  const exportData = async () => {
    try {
      const exportData = {
        habits,
        exportDate: new Date().toISOString(),
        stats: monthlyStats,
      };
      
      Alert.alert(
        'Export Data',
        'Your data has been prepared for export. In a real app, this would save to your files or email.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const WeeklyChart = () => {
    const maxCompletion = Math.max(...weeklyData.map(d => d.completion));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Progress</Text>
        <View style={styles.chartBars}>
          {weeklyData.map((day, index) => (
            <Animatable.View
              key={day.day}
              animation="slideInUp"
              delay={index * 100}
              style={styles.barContainer}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height: (day.completion / maxCompletion) * 120,
                    backgroundColor: day.completion > 70 ? '#27ae60' : 
                                   day.completion > 40 ? '#f39c12' : '#e74c3c',
                  }
                ]}
              />
              <Text style={styles.barLabel}>{day.day}</Text>
              <Text style={styles.barValue}>{Math.round(day.completion)}%</Text>
            </Animatable.View>
          ))}
        </View>
      </View>
    );
  };

  const StatCard = ({ icon, title, value, subtitle, color, trend }) => (
    <Animatable.View
      animation="fadeInUp"
      style={[styles.statCard, { borderTopColor: color }]}
    >
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
        {trend && (
          <Ionicons 
            name={trend === 'up' ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={trend === 'up' ? '#27ae60' : '#e74c3c'} 
          />
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </Animatable.View>
  );

  const CalendarView = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    
    const calendarDays = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const completionRate = Math.random();
      calendarDays.push({
        day,
        completion: completionRate,
        isToday: day === today.getDate(),
      });
    }

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.chartTitle}>Monthly Calendar</Text>
        <View style={styles.calendarHeader}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={styles.calendarHeaderDay}>{day}</Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <View
              key={index}
              style={[
                styles.calendarDay,
                day && {
                  backgroundColor: day.completion > 0.7 ? '#27ae60' :
                                 day.completion > 0.4 ? '#f39c12' :
                                 day.completion > 0 ? '#e74c3c' : '#ecf0f1',
                },
                day && day.isToday && styles.calendarToday,
              ]}
            >
              {day && (
                <Text
                  style={[
                    styles.calendarDayText,
                    day.completion > 0.4 && { color: 'white' },
                    day.isToday && styles.calendarTodayText,
                  ]}
                >
                  {day.day}
                </Text>
              )}
            </View>
          ))}
        </View>
        
        {/* Legend */}
        <View style={styles.calendarLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#27ae60' }]} />
            <Text style={styles.legendText}>Excellent (70%+)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
            <Text style={styles.legendText}>Good (40-70%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>Needs Work (&lt;40%)</Text>
          </View>
        </View>
      </View>
    );
  };

  const periods = ['Week', 'Month', 'Year'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress Analytics</Text>
          <TouchableOpacity onPress={exportData} style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#3498db" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.selectedPeriodText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <StatCard
              icon="flame"
              title="Current Streak"
              value={`${monthlyStats.currentStreak} days`}
              subtitle="Keep it up!"
              color="#e74c3c"
              trend="up"
            />
            <StatCard
              icon="trophy"
              title="Best Streak"
              value={`${monthlyStats.bestStreak} days`}
              subtitle="Personal record"
              color="#f39c12"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon="checkmark-circle"
              title="Total Completions"
              value={monthlyStats.totalCompletions}
              subtitle="This month"
              color="#27ae60"
              trend="up"
            />
            <StatCard
              icon="calendar"
              title="Missed Days"
              value={monthlyStats.missedDays}
              subtitle="This month"
              color="#95a5a6"
              trend="down"
            />
          </View>
        </View>

        {/* Weekly Chart */}
        <Animatable.View animation="fadeInUp" delay={200}>
          <WeeklyChart />
        </Animatable.View>

        {/* Calendar View */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <CalendarView />
        </Animatable.View>

        {/* Habit Performance */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.performanceSection}>
          <Text style={styles.chartTitle}>Habit Performance</Text>
          {habits.map((habit, index) => (
            <View key={habit.id} style={styles.habitPerformance}>
              <View style={styles.habitPerformanceHeader}>
                <View style={[
                  styles.habitPerformanceIcon,
                  { backgroundColor: getCategoryColor(habit.category) }
                ]}>
                  <Ionicons name={habit.icon} size={16} color="white" />
                </View>
                <Text style={styles.habitPerformanceName}>{habit.text}</Text>
                <Text style={styles.habitPerformanceRate}>
                  {Math.floor(Math.random() * 30 + 60)}%
                </Text>
              </View>
              <View style={styles.habitPerformanceBar}>
                <View
                  style={[
                    styles.habitPerformanceFill,
                    {
                      width: `${Math.floor(Math.random() * 30 + 60)}%`,
                      backgroundColor: getCategoryColor(habit.category),
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </Animatable.View>

        {/* Insights */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.insightsSection}>
          <Text style={styles.chartTitle}>Insights & Tips</Text>
          <View style={styles.insightCard}>
            <Ionicons name="bulb" size={24} color="#f39c12" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>You're doing great!</Text>
              <Text style={styles.insightText}>
                Your completion rate is above average. Try to maintain consistency on weekends.
              </Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <Ionicons name="trending-up" size={24} color="#27ae60" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Improvement Detected</Text>
              <Text style={styles.insightText}>
                Your streak has increased by 40% compared to last month. Keep it up!
              </Text>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getCategoryColor = (category) => {
  const colors = {
    Health: '#27ae60',
    Productivity: '#3498db',
    Learning: '#f39c12',
    Social: '#e74c3c',
    Personal: '#9b59b6',
  };
  return colors[category] || '#95a5a6';
};

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
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  exportButton: {
    padding: 8,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: '#3498db',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  selectedPeriodText: {
    color: 'white',
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: 'white',
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 12,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  barLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  barValue: {
    fontSize: 10,
    color: '#95a5a6',
  },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  calendarHeaderDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  calendarDay: {
    width: (width - 80) / 7,
    height: (width - 80) / 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 4,
  },
  calendarToday: {
    borderWidth: 2,
    borderColor: '#3498db',
  },
  calendarDayText: {
    fontSize: 12,
    color: '#2c3e50',
  },
  calendarTodayText: {
    fontWeight: 'bold',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  performanceSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitPerformance: {
    marginBottom: 15,
  },
  habitPerformanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitPerformanceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  habitPerformanceName: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
  },
  habitPerformanceRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  habitPerformanceBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  habitPerformanceFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightsSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  insightContent: {
    flex: 1,
    marginLeft: 15,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  insightText: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
  },
});
