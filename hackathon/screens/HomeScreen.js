import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  RefreshControl,
  Animated,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import api from "../services/api";
import { getRandomTipKey } from "../utils/getRandomTip";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const { t, i18n } = useTranslation();

  const loadTip = async () => {
    if (auth.currentUser) {
      const tipKey = await getRandomTipKey(auth.currentUser.uid);
      setTip(t(tipKey));
    } else {
      setTip("Please login to get personalized tips.");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      api.get("/").then((res) => setMessage(res.data.message)).catch((err) => console.error(err)),
      loadTip()
    ]).finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    api.get("/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error(err));
    loadTip();

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserName = () => {
    const email = auth.currentUser?.email;
    return email ? email.split('@')[0] : 'User';
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => signOut(auth) }
      ]
    );
  };

  const quickActions = [
    {
      id: 'report',
      title: 'Report Fraud',
      subtitle: 'Report suspicious activity',
      icon: 'shield-outline',
      color: '#FF3B30',
      gradient: ['#FF3B30', '#FF6B6B'],
      route: 'ReportFraud'
    },
    {
      id: 'community',
      title: 'Community',
      subtitle: 'Join discussions',
      icon: 'people-outline',
      color: '#007AFF',
      gradient: ['#007AFF', '#4DA6FF'],
      route: 'Community'
    },
    {
      id: 'emergency',
      title: 'Emergency',
      subtitle: 'Quick help access',
      icon: 'medical-outline',
      color: '#FF9500',
      gradient: ['#FF9500', '#FFB84D'],
      route: 'Emergency'
    },
    {
      id: 'quiz',
      title: 'Security Quiz',
      subtitle: 'Test your knowledge',
      icon: 'school-outline',
      color: '#34C759',
      gradient: ['#34C759', '#5DD579'],
      route: 'Quiz'
    }
  ];

  const featuredSections = [
    {
      id: 'tips',
      title: 'Safety Tips',
      icon: 'bulb-outline',
      color: '#5856D6',
      route: 'Tips'
    },
    {
      id: 'guides',
      title: 'Security Guides',
      icon: 'book-outline',
      color: '#FF2D92',
      route: 'Guides'
    },
    {
      id: 'threats',
      title: 'Threat Feed',
      icon: 'warning-outline',
      color: '#FF3B30',
      route: 'ThreatFeed'
    },
    {
      id: 'chat',
      title: 'AI Assistant',
      icon: 'chatbubble-outline',
      color: '#30D158',
      route: 'Chat'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Section */}
          <LinearGradient
            colors={['#1A1A2E', '#16213E', '#0F3460']}
            style={styles.headerSection}
          >
            <View style={styles.headerTop}>
              <View style={styles.userInfo}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{getUserName()} 👋</Text>
                <Text style={styles.currentTime}>
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.languageBtn} onPress={() => {
                  Alert.alert(
                    "Language",
                    "Choose your preferred language",
                    [
                      { text: "English", onPress: () => i18n.changeLanguage("en") },
                      { text: "ಕನ್ನಡ", onPress: () => i18n.changeLanguage("kn") },
                      { text: "Cancel", style: "cancel" }
                    ]
                  );
                }}>
                  <Ionicons name="language-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.profileBtn}
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Ionicons name="person-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Security Status Card */}
            <View style={styles.securityCard}>
              <LinearGradient
                colors={['rgba(52, 199, 89, 0.1)', 'rgba(52, 199, 89, 0.05)']}
                style={styles.securityCardGradient}
              >
                <View style={styles.securityStatus}>
                  <Ionicons name="shield-checkmark" size={32} color="#34C759" />
                  <View style={styles.securityInfo}>
                    <Text style={styles.securityTitle}>System Secure</Text>
                    <Text style={styles.securitySubtitle}>All security checks passed</Text>
                  </View>
                  <TouchableOpacity style={styles.securityBtn}>
                    <Ionicons name="chevron-forward" size={20} color="#34C759" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </LinearGradient>

          {/* Quick Actions Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionCard}
                  onPress={() => navigation.navigate(action.route)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={action.gradient}
                    style={styles.actionCardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name={action.icon} size={28} color="#FFFFFF" />
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Daily Tip Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Daily Security Tip</Text>
            <View style={styles.tipCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.tipCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.tipText}>{tip || "Loading your personalized tip..."}</Text>
                <TouchableOpacity style={styles.refreshTipBtn} onPress={loadTip}>
                  <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.refreshTipText}>New Tip</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Featured Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <View style={styles.featuredGrid}>
              {featuredSections.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  style={styles.featuredCard}
                  onPress={() => navigation.navigate(section.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.featuredIcon, { backgroundColor: section.color + '20' }]}>
                    <Ionicons name={section.icon} size={24} color={section.color} />
                  </View>
                  <Text style={styles.featuredTitle}>{section.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Tips Read</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Quizzes Taken</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>98%</Text>
                <Text style={styles.statLabel}>Security Score</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  currentTime: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  securityCardGradient: {
    padding: 20,
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityInfo: {
    flex: 1,
    marginLeft: 16,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  securitySubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  securityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionCardGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  tipCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tipCardGradient: {
    padding: 24,
    borderRadius: 16,
  },
  tipText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshTipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshTipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  featuredGrid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  featuredIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 8,
  },
});