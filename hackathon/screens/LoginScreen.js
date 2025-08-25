import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase";
import * as AuthSession from "expo-auth-session";
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  
  // Expo Google OAuth hook
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "134061999942-80aonjgeqm20h8mf4bjsrotcukh318ti.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      setLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Authentication error:", error);
        });
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="person-outline" size={40} color="#FFFFFF" />
          </View>
        </View>
        
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subtitleText}>Sign in to continue to your account</Text>
      </View>

      {/* Main Content */}
      <View style={styles.contentSection}>
        
        {/* Google Login Button */}
        <TouchableOpacity
          style={[styles.googleButton, (!request || loading) && styles.disabledButton]}
          disabled={!request || loading}
          onPress={handleGoogleLogin}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("Signup")}
          activeOpacity={0.8}
        >
          <Text style={styles.signupButtonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
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
    height: height * 0.5,
    backgroundColor: "#6366F1",
    opacity: 0.1,
  },
  
  headerSection: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  
  logoContainer: {
    marginBottom: 30,
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
  
  contentSection: {
    flex: 0.5,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  
  googleButton: {
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
  
  googleIcon: {
    marginRight: 12,
  },
  
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#334155",
  },
  
  dividerText: {
    color: "#64748B",
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: "500",
  },
  
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#6366F1",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  
  signupButtonText: {
    color: "#6366F1",
    fontSize: 16,
    fontWeight: "600",
  },
  
  footer: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  
  footerText: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});