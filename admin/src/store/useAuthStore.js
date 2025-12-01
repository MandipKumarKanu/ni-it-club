import { create } from "zustand";
import { toast } from "react-hot-toast";
import api from "../services/api"; 

export const useAuthStore = create((set) => ({
  loading: false,
  error: null,
  token: null,
  user: null,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data.role !== "admin") {
        toast.error("Access denied. Admins only.");
        await api.post("/auth/logout");
        set({ loading: false });
        return;
      }

      const { accessToken, ...userData } = data;
      set({ loading: false, user: userData, token: accessToken });
      toast.success("Login Successful");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      set({ error: msg, loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ loading: false, user: null, token: null });
      toast.success("Logged out");
    } catch (error) {
      console.error(error);
      set({ loading: false, user: null, token: null });
    }
  },
}));
