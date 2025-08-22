import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { db } from "../firebase"; // make sure path is correct

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    };
    fetchProfile();
  }, []);

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
    </View>
  );
}
