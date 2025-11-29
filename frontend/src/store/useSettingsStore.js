import { create } from "zustand";
import api from "../services/api";

const useSettingsStore = create((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/settings");
      set({ settings: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useSettingsStore;
