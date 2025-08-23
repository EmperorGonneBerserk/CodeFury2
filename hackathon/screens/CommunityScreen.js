import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, StyleSheet } from "react-native";

export default function CommunityChatScreen() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const API_URL = "http://10.0.2.2:8000"; // Use 10.0.2.2 for Android Emulator, localhost for web

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages/`);
      const data = await response.json();
      setMessages(data.reverse()); // latest at bottom
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_URL}/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, user: "Anonymous" }), // Replace with real user later
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh chat
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.user}>{item.user}:</Text>
            <Text style={styles.text}>{item.content}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  message: { flexDirection: "row", marginVertical: 5 },
  user: { fontWeight: "bold", marginRight: 5 },
  text: { flexShrink: 1 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
  },
});
