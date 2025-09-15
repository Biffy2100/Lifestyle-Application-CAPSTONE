import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { habitsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HabitsScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Health');
  const [selectedIcon, setSelectedIcon] = useState('fitness');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = ['Health', 'Productivity', 'Learning', 'Social', 'Personal'];
  const icons = ['fitness', 'book', 'water', 'bed', 'walk', 'nutrition', 'phone', 'time'];

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setIsLoading(true);
      const result = await habitsAPI.getHabits();
      if (result.success) {
        setHabits(result.data.habits || []);
      } else {
        Alert.alert('Error', result.message || 'Failed to load habits');
        // Fallback to empty array
        setHabits([]);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      Alert.alert('Error', 'Failed to load habits. Please try again.');
      setHabits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHabits();
    setIsRefreshing(false);
  };

  const addHabit = async () => {
    if (newHabitText.trim() === '') {
      Alert.alert('Invalid Input', 'Please enter a habit name');
      return;
    }

    try {
      const newHabitData = {
        text: newHabitText.trim(),
        category: selectedCategory,
        icon: selectedIcon,
      };

      const result = await habitsAPI.createHabit(newHabitData);
      
      if (result.success) {
        // Add the new habit to the local state
        setHabits(prevHabits => [result.data.habit, ...prevHabits]);
        
        // Reset form
        setNewHabitText('');
        setSelectedCategory('Health');
        setSelectedIcon('fitness');
        setIsAddModalVisible(false);
        
        Alert.alert('Success', 'Habit created successfully!');
      } else {
        Alert.alert('Error', result.message || 'Failed to create habit');
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    }
  };
    setSelectedCategory('Health');
    setSelectedIcon('fitness');
    setIsAddModalVisible(false);
  };

  const toggleHabit = async (habitId) => {
    try {
      const result = await habitsAPI.toggleHabitCompletion(habitId);
      
      if (result.success) {
        // Update the local state with the updated habit from API
        setHabits(prevHabits => 
          prevHabits.map(habit => 
            habit._id === habitId ? result.data.habit : habit
          )
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to update habit');
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
      Alert.alert('Error', 'Failed to update habit. Please try again.');
    }
  };

  const deleteHabit = (habitId) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await habitsAPI.deleteHabit(habitId);
              
              if (result.success) {
                // Remove the habit from local state
                setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
                Alert.alert('Success', 'Habit deleted successfully');
              } else {
                Alert.alert('Error', result.message || 'Failed to delete habit');
              }
            } catch (error) {
              console.error('Error deleting habit:', error);
              Alert.alert('Error', 'Failed to delete habit. Please try again.');
            }
          }
        }
      ]
    );
  };

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

  const renderHabitItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      style={styles.habitCard}
    >
      <View style={styles.habitHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.category) }]}>
          <Ionicons name={item.icon} size={20} color="white" />
        </View>
        <View style={styles.habitInfo}>
          <Text style={[styles.habitText, item.completed && styles.completedText]}>
            {item.text}
          </Text>
          <View style={styles.habitMeta}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.streakText}>🔥 {item.streak || 0} day streak</Text>
          </View>
        </View>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity
          style={[styles.checkButton, item.completed && styles.checkButtonCompleted]}
          onPress={() => toggleHabit(item._id)}
        >
          <Ionicons
            name={item.completed ? "checkmark" : "checkmark"}
            size={20}
            color={item.completed ? "white" : getCategoryColor(item.category)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteHabit(item._id)}
        >
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const AddHabitModal = () => {
    return (
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Habit</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#95a5a6" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter habit name..."
              value={newHabitText}
              onChangeText={setNewHabitText}
              maxLength={50}
            />

            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && {
                      backgroundColor: getCategoryColor(category),
                    }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.selectedCategoryText
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Icon</Text>
            <View style={styles.iconContainer}>
              {icons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconButton,
                    selectedIcon === icon && {
                      backgroundColor: getCategoryColor(selectedCategory),
                    }
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Ionicons
                    name={icon}
                    size={20}
                    color={selectedIcon === icon ? 'white' : '#95a5a6'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getCategoryColor(selectedCategory) }]}
                onPress={addHabit}
              >
                <Text style={styles.addButtonText}>Add Habit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <Text style={styles.subtitle}>
          {habits.filter(h => h.completed).length}/{habits.length} completed today
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </View>
      ) : habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#bdc3c7" />
          <Text style={styles.emptyStateTitle}>No habits yet!</Text>
          <Text style={styles.emptyStateText}>
            Start building better habits by adding your first one below.
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#3498db']}
              tintColor="#3498db"
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <AddHabitModal />
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
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  habitCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitInfo: {
    flex: 1,
  },
  habitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 5,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  habitMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  streakText: {
    fontSize: 12,
    color: '#e67e22',
  },
  habitActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkButtonCompleted: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  deleteButton: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  selectedCategoryText: {
    color: 'white',
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 0.45,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  addButton: {
    flex: 0.45,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
