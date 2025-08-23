import React from "react";
import { View, Text, Linking, Button } from "react-native";

export default function EmergencyScreen() {
  const callHelpline = () => {
    Linking.openURL("tel:1930"); // Indian Cybercrime Helpline
  };

  const reportOnline = () => {
    Linking.openURL("https://www.cybercrime.gov.in/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        🚨 Emergency Help
      </Text>
      <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}>
        If you are a victim of cyber fraud, act immediately.
      </Text>

      <Button title="📞 Call 1930 (Cyber Helpline)" onPress={callHelpline} />
      <View style={{ height: 15 }} />
      <Button title="🌐 Report on cybercrime.gov.in" onPress={reportOnline} />
    </View>
  );
}
