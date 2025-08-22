import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import api from "../services/api"; // axios instance pointing to FastAPI backend

export default function ChatbotScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    try {
      const res = await api.post("/chat", { message: input });
      // 👇 Fix: use `reply` instead of `response`
      setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: "Error: " + err.message }]);
    }

    setInput("");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        {messages.map((msg, idx) => (
          <Text
            key={idx}
            style={{ marginVertical: 5, color: msg.from === "user" ? "blue" : "green" }}
          >
            {msg.from === "user" ? "You: " : "Bot: "}
            {msg.text}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        value={input}
        onChangeText={setInput}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
