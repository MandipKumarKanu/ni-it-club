import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "https://ni-it-club.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
