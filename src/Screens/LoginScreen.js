import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const { login, signup, isLoading, error, clearError } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (isSignupMode) {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return false;
      }
      if (name.trim().length < 2) {
        Alert.alert('Error', 'Name must be at least 2 characters');
        return false;
      }
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    if (isSignupMode) {
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }

      if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        Alert.alert('Error', 'Password must contain at least one letter and one number');
        return false;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const { name, email, password } = formData;

    try {
      let result;
      if (isSignupMode) {
        result = await signup({ name, email, password });
      } else {
        result = await login({ email, password });
      }

      if (!result.success && result.message) {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    clearError();
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setIsPasswordVisible(!isPasswordVisible);
    } else {
      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3498db" barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="fitness" size={60} color="#ffffff" />
            </View>
            <Text style={styles.title}>Lifestyle App</Text>
            <Text style={styles.subtitle}>
              {isSignupMode 
                ? 'Create your account to start tracking habits' 
                : 'Welcome back! Please sign in to continue'
              }
            </Text>
          </Animatable.View>

          {/* Form */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.formContainer}>
            {/* Name field (only in signup mode) */}
            {isSignupMode && (
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholderTextColor="#bdc3c7"
                />
              </View>
            )}

            {/* Email field */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#bdc3c7"
              />
            </View>

            {/* Password field */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#bdc3c7"
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => togglePasswordVisibility('password')}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#7f8c8d"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password field (only in signup mode) */}
            {isSignupMode && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#bdc3c7"
                />
                <TouchableOpacity
                  style={styles.visibilityToggle}
                  onPress={() => togglePasswordVisibility('confirmPassword')}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#7f8c8d"
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Error message */}
            {error && (
              <Animatable.View animation="shake" style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </Animatable.View>
            )}

            {/* Submit button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignupMode ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle mode button */}
            <TouchableOpacity style={styles.toggleModeButton} onPress={toggleMode}>
              <Text style={styles.toggleModeText}>
                {isSignupMode 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Text>
            </TouchableOpacity>

            {/* Demo Credentials (only in sign-in mode) */}
            {!isSignupMode && (
              <View style={styles.demoCredentials}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <Text style={styles.demoText}>Email: admin@example.com</Text>
                <Text style={styles.demoText}>Password: admin123</Text>
                <Text style={styles.demoSubtext}>
                  Or create a new account with your own credentials
                </Text>
              </View>
            )}
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 300,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 15,
  },
  visibilityToggle: {
    padding: 5,
  },
  errorContainer: {
    backgroundColor: '#ffeaa7',
    borderLeftWidth: 4,
    borderLeftColor: '#e17055',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#e17055',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleModeText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  demoCredentials: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  demoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginVertical: 2,
  },
  demoSubtext: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
  },
});