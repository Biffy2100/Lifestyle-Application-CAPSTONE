import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2024-01-15',
    avatar: null,
  });
  
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    totalCompletions: 156,
    longestStreak: 15,
    perfectDays: 12,
    level: 5,
    experience: 750,
    nextLevelExp: 1000,
  });
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    loadProfileData();
    loadAchievements();
    loadStats();
  }, []);

  const loadProfileData = async () => {
    try {
      const name = await AsyncStorage.getItem('@user_name');
      const email = await AsyncStorage.getItem('@user_email');
      const joinDate = await AsyncStorage.getItem('@user_join_date');
      
      if (name) setUserProfile(prev => ({ ...prev, name }));
      if (email) setUserProfile(prev => ({ ...prev, email }));
      if (joinDate) setUserProfile(prev => ({ ...prev, joinDate }));
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadAchievements = () => {
    const allAchievements = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Complete your first habit',
        icon: 'walk',
        earned: true,
        earnedDate: '2024-01-16',
        color: '#27ae60',
      },
      {
        id: 2,
        title: 'Streak Master',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        earned: true,
        earnedDate: '2024-01-23',
        color: '#e74c3c',
      },
      {
        id: 3,
        title: 'Consistency King',
        description: 'Complete 100 habits',
        icon: 'trophy',
        earned: true,
        earnedDate: '2024-02-15',
        color: '#f39c12',
      },
      {
        id: 4,
        title: 'Perfect Week',
        description: 'Complete all habits for 7 days',
        icon: 'star',
        earned: false,
        color: '#9b59b6',
      },
      {
        id: 5,
        title: 'Habit Hero',
        description: 'Maintain 5 habits simultaneously',
        icon: 'medal',
        earned: true,
        earnedDate: '2024-03-01',
        color: '#3498db',
      },
      {
        id: 6,
        title: 'Monthly Champion',
        description: 'Complete all habits for 30 days',
        icon: 'ribbon',
        earned: false,
        color: '#1abc9c',
      },
    ];
    setAchievements(allAchievements);
  };

  const loadStats = async () => {
    try {
      const habits = await AsyncStorage.getItem('@habits_data');
      if (habits) {
        const parsedHabits = JSON.parse(habits);
        setStats(prev => ({
          ...prev,
          totalHabits: parsedHabits.length,
        }));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('@user_name', editName);
      await AsyncStorage.setItem('@user_email', editEmail);
      
      setUserProfile(prev => ({
        ...prev,
        name: editName,
        email: editEmail,
      }));
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const openEditModal = () => {
    setEditName(userProfile.name);
    setEditEmail(userProfile.email);
    setEditModalVisible(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLevelProgress = () => {
    return (stats.experience / stats.nextLevelExp) * 100;
  };

  const ProfileHeader = () => (
    <Animatable.View animation="fadeInDown" style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        {userProfile.avatar ? (
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color="#95a5a6" />
          </View>
        )}
        <TouchableOpacity style={styles.editAvatarButton}>
          <Ionicons name="camera" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{userProfile.name}</Text>
        <Text style={styles.profileEmail}>{userProfile.email}</Text>
        <Text style={styles.joinDate}>
          Member since {formatDate(userProfile.joinDate)}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
        <Ionicons name="create-outline" size={20} color="#3498db" />
      </TouchableOpacity>
    </Animatable.View>
  );

  const LevelCard = () => (
    <Animatable.View animation="fadeInUp" delay={200} style={styles.levelCard}>
      <View style={styles.levelHeader}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelNumber}>{stats.level}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>Level {stats.level} Habit Builder</Text>
          <Text style={styles.experienceText}>
            {stats.experience} / {stats.nextLevelExp} XP
          </Text>
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[styles.progressBar, { width: `${getLevelProgress()}%` }]} 
        />
      </View>
      
      <Text style={styles.nextLevelText}>
        {stats.nextLevelExp - stats.experience} XP until Level {stats.level + 1}
      </Text>
    </Animatable.View>
  );

  const StatsGrid = () => (
    <Animatable.View animation="fadeInUp" delay={400} style={styles.statsGrid}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalHabits}</Text>
        <Text style={styles.statLabel}>Active Habits</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.totalCompletions}</Text>
        <Text style={styles.statLabel}>Completions</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.longestStreak}</Text>
        <Text style={styles.statLabel}>Best Streak</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{stats.perfectDays}</Text>
        <Text style={styles.statLabel}>Perfect Days</Text>
      </View>
    </Animatable.View>
  );

  const AchievementsSection = () => (
    <View style={styles.achievementsSection}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      <View style={styles.achievementsGrid}>
        {achievements.map((achievement, index) => (
          <Animatable.View
            key={achievement.id}
            animation="fadeInUp"
            delay={600 + index * 100}
            style={[
              styles.achievementCard,
              !achievement.earned && styles.lockedAchievement,
            ]}
          >
            <View style={[
              styles.achievementIcon,
              { backgroundColor: achievement.earned ? achievement.color : '#bdc3c7' }
            ]}>
              <Ionicons 
                name={achievement.icon} 
                size={24} 
                color="white" 
              />
            </View>
            <Text style={[
              styles.achievementTitle,
              !achievement.earned && styles.lockedText
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDescription,
              !achievement.earned && styles.lockedText
            ]}>
              {achievement.description}
            </Text>
            {achievement.earned && achievement.earnedDate && (
              <Text style={styles.earnedDate}>
                Earned {formatDate(achievement.earnedDate)}
              </Text>
            )}
            {!achievement.earned && (
              <View style={styles.lockIcon}>
                <Ionicons name="lock-closed" size={16} color="#95a5a6" />
              </View>
            )}
          </Animatable.View>
        ))}
      </View>
    </View>
  );

  const EditProfileModal = () => (
    <Modal visible={editModalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.modalInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Enter your name"
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.modalInput}
            value={editEmail}
            onChangeText={setEditEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader />
        <LevelCard />
        <StatsGrid />
        <AchievementsSection />
      </ScrollView>
      <EditProfileModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: '#95a5a6',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
  levelCard: {
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
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  experienceText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  nextLevelText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  achievementsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 5,
  },
  earnedDate: {
    fontSize: 10,
    color: '#27ae60',
    textAlign: 'center',
  },
  lockedText: {
    color: '#bdc3c7',
  },
  lockIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  saveButton: {
    flex: 0.45,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
