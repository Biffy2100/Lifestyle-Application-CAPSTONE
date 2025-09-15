import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FAB, Card, Text, Button, Portal, Dialog, TextInput, Chip } from 'react-native-paper';
import { loadHabits, saveHabits, createHabit, completeHabit } from './src/Services/HabitService';

export default function HabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCue, setNewHabitCue] = useState('');

  useEffect(() => {
    loadStoredHabits();
  }, []);

  const loadStoredHabits = async () => {
    const storedHabits = await loadHabits();
    setHabits(storedHabits);
  };

  const addHabit = async () => {
    if (newHabitName.trim()) {
      const habit = createHabit(
        newHabitName,
        '',
        newHabitCue,
        'Sense of accomplishment'
      );
      
      const updatedHabits = [...habits, habit];
      setHabits(updatedHabits);
      await saveHabits(updatedHabits);
      
      setNewHabitName('');
      setNewHabitCue('');
      setShowDialog(false);
    }
  };

  const markComplete = async (habitId, effortRating = 3, moodRating = 4) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId ? completeHabit(habit, effortRating, moodRating) : habit
    );
    
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const getTodayCompletion = (habit) => {
    const today = new Date().toDateString();
    return habit.completions.some(completion => 
      new Date(completion.timestamp).toDateString() === today
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {habits.map(habit => (
          <Card key={habit.id} style={styles.habitCard}>
            <Card.Content>
              <Text variant="headlineSmall">{habit.name}</Text>
              {habit.cue && (
                <Chip style={styles.cueChip} compact>
                  Cue: {habit.cue}
                </Chip>
              )}
              <Text variant="bodyMedium">
                Completions: {habit.completions.length}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode={getTodayCompletion(habit) ? "contained" : "outlined"}
                onPress={() => markComplete(habit.id)}
                disabled={getTodayCompletion(habit)}
              >
                {getTodayCompletion(habit) ? "✓ Done Today" : "Mark Complete"}
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowDialog(true)}
      />

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Add New Habit</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Habit Name"
              value={newHabitName}
              onChangeText={setNewHabitName}
              style={styles.input}
            />
            <TextInput
              label="Trigger/Cue (When will you do this?)"
              value={newHabitCue}
              onChangeText={setNewHabitCue}
              style={styles.input}
              placeholder="e.g., After morning coffee"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Cancel</Button>
            <Button onPress={addHabit}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  habitCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cueChip: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3498db',
  },
  input: {
    marginBottom: 12,
  },
});
