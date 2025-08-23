// HtmlScreen.js
import React from "react";
import { Platform, View, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function HtmlScreen() {
  if (Platform.OS === "web") {
    return (
      <iframe
        src={require("../assets/index.html")}
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
        }}
        title="Local HTML"
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>HTML screen only runs on Web 🌐</Text>
    </View>
  );
}
