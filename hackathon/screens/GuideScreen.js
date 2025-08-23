
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

const guides = {
  "UPI Safety": [
    "Never share your UPI PIN with anyone.",
    "Do not approve random collect requests on UPI apps.",
    "Verify recipient details before sending money."
  ],
  "Phishing Awareness": [
    "Check the sender’s email before clicking links.",
    "Avoid downloading attachments from unknown emails.",
    "Banks never ask for passwords or OTPs via email."
  ],
  "Social Media Safety": [
    "Use strong passwords for your social accounts.",
    "Do not overshare personal information.",
    "Beware of fake friend requests."
  ],
  "OTP Scams": [
    "Never share OTPs received on your phone.",
    "Legit companies never ask for OTP over calls.",
    "Report suspicious calls to 1930 immediately."
  ]
};

export default function GuidesScreen() {
  const [selected, setSelected] = useState(null);

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        📘 Cyber Safety Guides
      </Text>

      {Object.keys(guides).map((category) => (
        <View key={category} style={{ marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setSelected(selected === category ? null : category)}
            style={{
              padding: 15,
              backgroundColor: "#f2f2f2",
              borderRadius: 10
            }}
          >
            <Text style={{ fontSize: 18 }}>{category}</Text>
          </TouchableOpacity>

          {selected === category && (
            <View style={{ marginTop: 10, paddingLeft: 10 }}>
              {guides[category].map((tip, index) => (
                <Text key={index} style={{ fontSize: 16, marginBottom: 5 }}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
