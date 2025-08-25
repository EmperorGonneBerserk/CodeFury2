// services/api.js
import axios from "axios";

const isDev = process.env.NODE_ENV === "development";

const api = axios.create({
  baseURL: isDev
    ? "http://127.0.0.1:8000" // local dev
    : "https://codefury2.onrender.com", // production backend
});

export default api;
