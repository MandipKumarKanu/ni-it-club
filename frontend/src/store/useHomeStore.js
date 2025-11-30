import { create } from "zustand";
import api from "../services/api";

const useHomeStore = create((set, get) => ({
  homeData: null,
  loading: true,
  error: null,

  fetchHomeData: async () => {
    if (get().homeData) return;

    set({ loading: true });
    try {
      const { data } = await api.get("/home");
      set({ homeData: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch home data:", error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useHomeStore;
