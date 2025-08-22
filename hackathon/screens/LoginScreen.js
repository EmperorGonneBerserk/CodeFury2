import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase";
import * as AuthSession from "expo-auth-session";
console.log("hi",AuthSession.makeRedirectUri());


WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  // Expo Google OAuth hook
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "134061999942-80aonjgeqm20h8mf4bjsrotcukh318ti.apps.googleusercontent.com",
    redirectUri: "http://localhost:8081",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Login</Text>
      
      <Button title="Login with Google" disabled={!request} onPress={() => promptAsync()} />
      <Button title="Go to Signup" onPress={() => navigation.navigate("Signup")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
});
