import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import api from "../services/api";
import { getRandomTipKey } from "../utils/getRandomTip";
import { useTranslation } from "react-i18next";

export default function HomeScreen({ navigation }) {
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState("");
  const { t, i18n } = useTranslation();

  const loadTip = async () => {
    if (auth.currentUser) {
      const tipKey = await getRandomTipKey(auth.currentUser.uid);
      setTip(t(tipKey));
    } else {
      setTip("Please login to get personalized tips.");
    }
  };

  useEffect(() => {
    api.get("/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error(err));
    loadTip();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {auth.currentUser?.email}</Text>
      <Text>{message || "Loading..."}</Text>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>{t("app.title")}</Text>
      <Text style={{ marginVertical: 10 }}>{t("app.description")}</Text>
      <Button title="English" onPress={() => i18n.changeLanguage("en")} />
      <Button title="ಕನ್ನಡ" onPress={() => i18n.changeLanguage("kn")} />
      <Button title="Logout" onPress={() => signOut(auth)} />
      <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Go to Chat" onPress={() => navigation.navigate("Chat")} />
      <Button title="Go to Tips" onPress={() => navigation.navigate("Tips")} />
      <Button title="Go to Guides" onPress={() => navigation.navigate("Guides")} />
      <Button title="Emergency" onPress={() => navigation.navigate("Emergency")} />
      <Text style={{ fontSize: 18, marginBottom: 20, textAlign: "center" }}>
        💡 Cyber Safety Tip:{"\n\n"}{tip}
      </Text>
      <Button title="Show Another Tip" onPress={loadTip} />
    </View>
  );
}
