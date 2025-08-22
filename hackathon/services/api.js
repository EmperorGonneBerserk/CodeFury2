// services/api.js
import axios from "axios";

// Change baseURL if running on emulator vs physical device
const api = axios.create({
//   baseURL: "http://10.0.2.2:8000", // For Android Emulator
  baseURL: "http://127.0.0.1:8000", // For iOS Simulator
});

export default api;
