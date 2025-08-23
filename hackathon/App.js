import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./authservice";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatScreen from "./screens/ChatScreen";
import TipScreen from "./screens/TipScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import GuideScreen from "./screens/GuideScreen";
import ThreatFeedScreen from "./screens/ThreatFeedScreen";
import QuizScreen from "./screens/QuizScreen";
import HtmlScreen from "./screens/HtmlScreen";
import CommunityChatScreen from "./screens/CommunityChatScreen";
import ReportFraud from "./screens/ReportFraud";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

// Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
        style={styles.tabBar}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          // Get icon for each tab
          const getTabIcon = (routeName, focused) => {
            let iconName;
            let color = focused ? '#007AFF' : '#8E8E93';
            
            switch (routeName) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Chat':
                iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
                break;
              case 'Tips':
                iconName = focused ? 'bulb' : 'bulb-outline';
                break;
              case 'Emergency':
                iconName = focused ? 'medical' : 'medical-outline';
                color = focused ? '#FF3B30' : '#8E8E93';
                break;
              case 'Community':
                iconName = focused ? 'people' : 'people-outline';
                break;
              default:
                iconName = 'ellipse-outline';
            }
            
            return <Ionicons name={iconName} size={24} color={color} />;
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[styles.tabIconContainer, isFocused && styles.tabIconFocused]}>
                {getTabIcon(route.name, isFocused)}
              </View>
              <Text style={[styles.tabLabel, { color: isFocused ? '#007AFF' : '#8E8E93' }]}>
                {label}
              </Text>
              {isFocused && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

// Custom Drawer Content
function CustomDrawerContent(props) {
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => signOut(auth) 
        }
      ]
    );
  };

  const getUserName = () => {
    const email = auth.currentUser?.email;
    return email ? email.split('@')[0] : 'User';
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.drawerHeader}
      >
        <View style={styles.drawerProfileSection}>
          <View style={styles.drawerAvatar}>
            <Text style={styles.drawerAvatarText}>
              {getUserName().charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.drawerUserInfo}>
            <Text style={styles.drawerUserName}>{getUserName()}</Text>
            <Text style={styles.drawerUserEmail}>{auth.currentUser?.email}</Text>
          </View>
        </View>
        <View style={styles.drawerStats}>
          <View style={styles.drawerStatItem}>
            <Text style={styles.drawerStatNumber}>98%</Text>
            <Text style={styles.drawerStatLabel}>Security Score</Text>
          </View>
          <View style={styles.drawerStatItem}>
            <Text style={styles.drawerStatNumber}>12</Text>
            <Text style={styles.drawerStatLabel}>Tips Read</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Drawer Items */}
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <View style={styles.drawerSection}>
          <Text style={styles.drawerSectionTitle}>MAIN</Text>
          <DrawerItemList {...props} />
        </View>
        
        {/* Additional Actions */}
        <View style={styles.drawerSection}>
          <Text style={styles.drawerSectionTitle}>QUICK ACTIONS</Text>
          <TouchableOpacity 
            style={styles.drawerCustomItem}
            onPress={() => props.navigation.navigate('ReportFraud')}
          >
            <Ionicons name="shield-outline" size={24} color="#FF3B30" />
            <Text style={styles.drawerCustomItemText}>Report Fraud</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.drawerCustomItem}
            onPress={() => props.navigation.navigate('CommunityChat')}
          >
            <Ionicons name="people-outline" size={24} color="#007AFF" />
            <Text style={styles.drawerCustomItemText}>Community</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Bottom Tabs (Core Features)
function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: i18n.t("navigation.home", "Home"),
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ 
          title: i18n.t("navigation.chat", "AI Assistant"),
          tabBarLabel: "Chat"
        }}
      />
      <Tab.Screen 
        name="Emergency" 
        component={EmergencyScreen}
        options={{ 
          title: i18n.t("navigation.emergency", "Emergency"),
          tabBarLabel: "Emergency"
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityChatScreen}
        options={{ 
          title: i18n.t("navigation.community", "Community"),
          tabBarLabel: "Community"
        }}
      />
    </Tab.Navigator>
  );
}

// Drawer Navigation (wraps Bottom Tabs + Additional Screens)
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5EA',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#8E8E93',
        drawerActiveBackgroundColor: 'rgba(0, 122, 255, 0.1)',
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 12,
          marginVertical: 2,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
          marginLeft: -16,
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={BottomTabs} 
        options={{
          title: "CyberGuard Pro",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          headerLeft: ({ onPress }) => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={onPress}
            >
              <Ionicons name="menu" size={24} color="#000000" />
            </TouchableOpacity>
          ),
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: i18n.t("navigation.profile", "My Profile"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Guides" 
        component={GuideScreen}
        options={{
          title: i18n.t("navigation.guides", "Security Guides"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ThreatFeed" 
        component={ThreatFeedScreen} 
        options={{ 
          title: i18n.t("navigation.threatFeed", "Threat Feed"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="warning-outline" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{ 
          title: i18n.t("navigation.quiz", "Security Quiz"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="HTML" 
        component={HtmlScreen} 
        options={{ 
          title: i18n.t("navigation.html", "Resources"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }} 
      />
    </Drawer.Navigator>
  );
}

// Stack Navigator for Modal Screens
function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={DrawerNavigator} />
      {/* Modal Screens */}
      <Stack.Screen 
        name="ReportFraud" 
        component={ReportFraud}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Report Fraud',
          headerStyle: { backgroundColor: '#F2F2F7' },
        }}
      />
      <Stack.Screen 
        name="CommunityChat" 
        component={CommunityChatScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Community Chat',
          headerStyle: { backgroundColor: '#F2F2F7' },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#1A1A2E', '#16213E', '#0F3460']}
          style={styles.loadingGradient}
        >
          <Ionicons name="shield-checkmark" size={64} color="#FFFFFF" />
          <Text style={styles.loadingText}>CyberGuard Pro</Text>
          <Text style={styles.loadingSubtext}>Securing your digital world</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="App" component={MainStackNavigator} />
          ) : (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{
                  animationTypeForReplace: !user ? 'pop' : 'push',
                }}
              />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  // Loading Screen
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 8,
  },

  // Custom Tab Bar
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    height: 85,
    paddingBottom: 20,
    paddingTop: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIconContainer: {
    padding: 6,
    borderRadius: 12,
  },
  tabIconFocused: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },

  // Custom Drawer
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  drawerProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  drawerAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  drawerUserInfo: {
    flex: 1,
  },
  drawerUserName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  drawerUserEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  drawerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  drawerStatItem: {
    alignItems: 'center',
  },
  drawerStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  drawerStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  drawerSection: {
    marginBottom: 20,
  },
  drawerSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 1,
  },
  drawerCustomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  drawerCustomItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 12,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    padding: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },

  // Header Button
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});