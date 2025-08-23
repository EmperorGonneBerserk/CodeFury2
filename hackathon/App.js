import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
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

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import ThreatFeedScreen from "./screens/ThreatFeedScreen";

// Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


// Bottom Tabs (Home, Chat, Tips, Emergency)
function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen 
        name="Tips" 
        component={TipScreen} 
        options={{ title: i18n.t("navigation.tips") }} 
      />
      <Tab.Screen name="Emergency" component={EmergencyScreen} />
      <Tab.Screen 
        name="ThreatFeed" 
        component={ThreatFeedScreen} 
        options={{ title: i18n.t("navigation.threatFeed") }} 
      />
      
    </Tab.Navigator>
  );
}

// Drawer Navigation (wraps Bottom Tabs + Guides + Profile)
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name="Main" 
        component={BottomTabs} 
        options={{ title: "Dashboard" }} 
      />
      <Drawer.Screen name="Guides" component={GuideScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="App" component={DrawerNavigator} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}
