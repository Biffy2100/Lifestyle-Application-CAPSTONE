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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function HabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Health');
  const [selectedIcon, setSelectedIcon] = useState('fitness');

  const categories = ['Health', 'Productivity', 'Learning', 'Social', 'Personal'];
  const icons = ['fitness', 'book', 'water', 'bed', 'walk', 'nutrition', 'phone', 'time'];

  const STORAGE_KEY = '@habits_data';

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async (habitsToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habitsToSave));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const addHabit = () => {
    if (newHabitText.trim() === '') {
      Alert.alert('Invalid Input', 'Please enter a habit name');
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      text: newHabitText.trim(),
      category: selectedCategory,
      icon: selectedIcon,
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);

    // Reset form
    setNewHabitText('');
    setSelectedCategory('Health');
    setSelectedIcon('fitness');
    setIsAddModalVisible(false);
  };

  const toggleHabit = (habitId) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completed;
        return {
          ...habit,
          completed: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
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
          onPress: () => {
            const updatedHabits = habits.filter(habit => habit.id !== habitId);
            setHabits(updatedHabits);
            saveHabits(updatedHabits);
          },
        },
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
            <Text style={styles.streakText}>🔥 {item.streak} day streak</Text>
          </View>
        </View>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity
          style={[styles.checkButton, item.completed && styles.checkButtonCompleted]}
          onPress={() => toggleHabit(item.id)}
        >
          <Ionicons
            name={item.completed ? "checkmark" : "checkmark"}
            size={20}
            color={item.completed ? "white" : getCategoryColor(item.category)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteHabit(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const AddHabitModal = () => (
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <Text style={styles.subtitle}>
          {habits.filter(h => h.completed).length}/{habits.length} completed today
        </Text>
      </View>

      {habits.length === 0 ? (
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
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
