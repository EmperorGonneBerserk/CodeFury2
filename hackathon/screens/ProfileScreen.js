import React, { useEffect, useState } from "react";
import { View, Text, Image, Button } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../firebase";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const auth = getAuth();
  const demographics = ["student", "professional", "homemaker", "rural", "senior"];

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setSelectedDemo(data.demographic || null);
        }
      }
    };
    fetchProfile();
  }, []);

  const saveDemographic = async () => {
    const user = auth.currentUser;
    if (!user || !selectedDemo) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        demographic: selectedDemo,
      });
      setProfile({ ...profile, demographic: selectedDemo });
      alert("Demographic updated!");
    } catch (error) {
      console.error("Error updating demographic:", error);
    }
  };

  if (!profile) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
      <Image
        source={{ uri: profile.profilePicture || "https://www.gravatar.com/avatar?d=mp" }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{profile.name}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Username: {profile.username}</Text>
      <Text>Bio: {profile.bio || "No bio yet"}</Text>

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Your Demographic:</Text>
      {demographics.map((demo) => (
        <Button
          key={demo}
          title={demo}
          color={selectedDemo === demo ? "green" : "blue"}
          onPress={() => setSelectedDemo(demo)}
        />
      ))}

      <Button title="Save Demographic" onPress={saveDemographic} style={{ marginTop: 10 }} />
    </View>
  );
}
