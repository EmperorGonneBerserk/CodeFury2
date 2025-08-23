import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignup = async () => {
    setError("");
    
    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    secureTextEntry = false,
    inputKey,
    showPasswordToggle = false,
    passwordVisible = false,
    setPasswordVisible = null
  ) => (
    <View style={styles.inputContainer}>
      <View style={[
        styles.inputWrapper,
        focusedInput === inputKey && styles.inputWrapperFocused,
        error && styles.inputWrapperError
      ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#64748B"
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !passwordVisible}
          autoCapitalize="none"
          onFocus={() => setFocusedInput(inputKey)}
          onBlur={() => setFocusedInput(null)}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="person-add-outline" size={40} color="#FFFFFF" />
              </View>
            </View>
            
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>Fill in your details to get started</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {renderInput(
              "Full Name",
              fullName,
              setFullName,
              "default",
              false,
              "fullName"
            )}

            {renderInput(
              "Email Address",
              email,
              setEmail,
              "email-address",
              false,
              "email"
            )}

            {renderInput(
              "Password",
              password,
              setPassword,
              "default",
              true,
              "password",
              true,
              showPassword,
              setShowPassword
            )}

            {renderInput(
              "Confirm Password",
              confirmPassword,
              setConfirmPassword,
              "default",
              true,
              "confirmPassword",
              true,
              showConfirmPassword,
              setShowConfirmPassword
            )}

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Password Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={password.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={password.length >= 6 ? "#10B981" : "#64748B"} 
                />
                <Text style={[
                  styles.requirementText,
                  password.length >= 6 && styles.requirementMet
                ]}>
                  At least 6 characters
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={password === confirmPassword && password ? "checkmark-circle" : "ellipse-outline"} 
                  size={16} 
                  color={password === confirmPassword && password ? "#10B981" : "#64748B"} 
                />
                <Text style={[
                  styles.requirementText,
                  password === confirmPassword && password && styles.requirementMet
                ]}>
                  Passwords match
                </Text>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={[styles.signupButton, loading && styles.disabledButton]}
              disabled={loading}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.signupButtonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.arrowIcon} />
                </>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: "#6366F1",
    opacity: 0.1,
  },
  
  keyboardView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
  },
  
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  logoContainer: {
    marginBottom: 24,
    marginTop: 40,
  },
  
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  
  welcomeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  
  subtitleText: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
  },
  
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  
  inputContainer: {
    marginBottom: 20,
  },
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1E293B",
    borderWidth: 2,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  
  inputWrapperFocused: {
    borderColor: "#6366F1",
    backgroundColor: "#1E293B",
  },
  
  inputWrapperError: {
    borderColor: "#EF4444",
  },
  
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#FFFFFF",
  },
  
  eyeIcon: {
    padding: 4,
  },
  
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  
  requirementsContainer: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  
  requirementsTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  
  requirementText: {
    color: "#64748B",
    fontSize: 14,
    marginLeft: 8,
  },
  
  requirementMet: {
    color: "#10B981",
  },
  
  signupButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  disabledButton: {
    backgroundColor: "#475569",
    shadowOpacity: 0,
    elevation: 0,
  },
  
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  
  arrowIcon: {
    marginLeft: 4,
  },
  
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  
  loginText: {
    color: "#64748B",
    fontSize: 16,
  },
  
  loginLink: {
    color: "#6366F1",
    fontSize: 16,
    fontWeight: "600",
  },
});