import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function TipScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tips"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched data:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10, padding: 10, backgroundColor: "#5a9d18ff", borderRadius: 8 }}>
            <Text style={{ fontSize: 16 }}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}
