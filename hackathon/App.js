import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./authservice"; // just importing triggers the listener

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen"; // Import ProfileScreen if needed
import ChatScreen from "./screens/ChatScreen";
import TipScreen from "./screens/TipScreen"; // Import TipScreen if needed
import EmergencyScreen from "./screens/EmergencyScreen";
import GuideScreen from "./screens/GuideScreen";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Tips" component={TipScreen} options={{ title: i18n.t("navigation.tips") }}/>
            <Stack.Screen name="Guides" component={GuideScreen} />
            <Stack.Screen name="Emergency" component={EmergencyScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </I18nextProvider>
  );
}
