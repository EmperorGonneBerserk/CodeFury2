import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { db } from "../firebase";

const { width } = Dimensions.get('window');

const DEMOGRAPHICS_CONFIG = {
  student: {
    label: "Student",
    icon: "school-outline",
    color: "#3B82F6",
    description: "Learning and exploring technology"
  },
  professional: {
    label: "Professional",
    icon: "briefcase-outline",
    color: "#10B981",
    description: "Working in corporate environment"
  },
  homemaker: {
    label: "Homemaker",
    icon: "home-outline",
    color: "#F59E0B",
    description: "Managing household and family"
  },
  rural: {
    label: "Rural Community",
    icon: "leaf-outline",
    color: "#8B5CF6",
    description: "Living in rural areas"
  },
  senior: {
    label: "Senior Citizen",
    icon: "people-outline",
    color: "#EF4444",
    description: "Experienced and wise"
  }
};

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              name: data.name || user.displayName || "User",
              email: data.email || user.email,
              username: data.username || "Not set",
              bio: data.bio || "Staying safe online",
              profilePicture: data.profilePicture || user.photoURL,
              demographic: data.demographic,
              ...data
            });
            setSelectedDemo(data.demographic || null);
          } else {
            // Create basic profile from auth data
            setProfile({
              name: user.displayName || "User",
              email: user.email,
              username: "Not set",
              bio: "Staying safe online",
              profilePicture: user.photoURL,
              demographic: null
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const saveDemographic = async () => {
    const user = auth.currentUser;
    if (!user || !selectedDemo) {
      Alert.alert("Error", "Please select a demographic first");
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        demographic: selectedDemo,
      });
      setProfile({ ...profile, demographic: selectedDemo });
      Alert.alert("Success", "Your profile has been updated!", [
        { text: "OK" }
      ]);
    } catch (error) {
      console.error("Error updating demographic:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.error("Error signing out:", error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: profile.profilePicture || "https://www.gravatar.com/avatar?d=mp&s=200"
              }}
              style={styles.profileImage}
            />
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
          
          {profile.demographic && (
            <View style={[
              styles.currentDemoBadge,
              { backgroundColor: DEMOGRAPHICS_CONFIG[profile.demographic]?.color + '20' }
            ]}>
              <Ionicons 
                name={DEMOGRAPHICS_CONFIG[profile.demographic]?.icon}
                size={16}
                color={DEMOGRAPHICS_CONFIG[profile.demographic]?.color}
              />
              <Text style={[
                styles.currentDemoText,
                { color: DEMOGRAPHICS_CONFIG[profile.demographic]?.color }
              ]}>
                {DEMOGRAPHICS_CONFIG[profile.demographic]?.label}
              </Text>
            </View>
          )}
          
          <Text style={styles.userBio}>{profile.bio}</Text>
        </View>

        {/* Cyber Safety Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-outline" size={24} color="#6366F1" />
            <Text style={styles.sectionTitle}>Cyber Safety Profile</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Help us customize your cybersecurity learning experience by selecting your demographic.
          </Text>
        </View>

        {/* Demographics Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Select Your Profile</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the option that best describes you for personalized security tips
          </Text>
          
          <View style={styles.demographicsGrid}>
            {Object.entries(DEMOGRAPHICS_CONFIG).map(([key, config]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.demographicCard,
                  selectedDemo === key && styles.demographicCardSelected,
                  { borderColor: selectedDemo === key ? config.color : '#334155' }
                ]}
                onPress={() => setSelectedDemo(key)}
                activeOpacity={0.7}
              >
                <View style={[styles.demographicIcon, { backgroundColor: config.color + '20' }]}>
                  <Ionicons name={config.icon} size={24} color={config.color} />
                </View>
                
                <Text style={[
                  styles.demographicLabel,
                  selectedDemo === key && { color: config.color }
                ]}>
                  {config.label}
                </Text>
                
                <Text style={styles.demographicDescription}>
                  {config.description}
                </Text>
                
                {selectedDemo === key && (
                  <View style={[styles.selectedIndicator, { backgroundColor: config.color }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!selectedDemo || saving) && styles.saveButtonDisabled
            ]}
            disabled={!selectedDemo || saving}
            onPress={saveDemographic}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Update Profile</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View style={[styles.sectionCard, styles.tipsCard]}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
            <Text style={styles.tipsTitle}>Quick Security Tip</Text>
          </View>
          <Text style={styles.tipsText}>
            Keep your profile information updated to receive the most relevant cybersecurity guidance for your lifestyle and needs.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  loadingText: {
    color: "#94A3B8",
    fontSize: 16,
    marginTop: 16,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  errorText: {
    color: "#EF4444",
    fontSize: 18,
    marginTop: 16,
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#6366F1",
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  profileCard: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#6366F1",
  },
  
  securityBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1E293B",
  },
  
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  
  userEmail: {
    fontSize: 16,
    color: "#94A3B8",
    marginBottom: 12,
  },
  
  currentDemoBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  
  currentDemoText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  
  userBio: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    fontStyle: "italic",
  },
  
  sectionCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  
  sectionSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 20,
    lineHeight: 20,
  },
  
  sectionDescription: {
    fontSize: 16,
    color: "#94A3B8",
    lineHeight: 24,
  },
  
  demographicsGrid: {
    gap: 12,
  },
  
  demographicCard: {
    backgroundColor: "#334155",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#334155",
    position: "relative",
  },
  
  demographicCardSelected: {
    backgroundColor: "#1E293B",
  },
  
  demographicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  
  demographicLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  
  demographicDescription: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
  
  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  
  actionSection: {
    marginVertical: 20,
  },
  
  saveButton: {
    backgroundColor: "#6366F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  saveButtonDisabled: {
    backgroundColor: "#475569",
    shadowOpacity: 0,
    elevation: 0,
  },
  
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  
  tipsCard: {
    backgroundColor: "#1E293B",
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    marginBottom: 40,
  },
  
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
    marginLeft: 8,
  },
  
  tipsText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 22,
  },
});