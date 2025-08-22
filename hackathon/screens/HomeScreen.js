import React, {useState,useEffect} from "react";
import { View, Text, Button } from "react-native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import api from "../services/api";

export default function HomeScreen({navigation}) {
    const [message, setMessage] = useState("");

    useEffect(() => {
    api.get("/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error(err));
    }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome, {auth.currentUser?.email}</Text>
      <Text>{message || "Loading..."}</Text>
      <Button title="Logout" onPress={() => signOut(auth)} />
      <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")}/>
      <Button title="Go to Chat" onPress={() => navigation.navigate("Chat")}/>
    </View>
  );
}
