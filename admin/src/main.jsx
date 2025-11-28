import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { setupInterceptors } from "./services/api.js";
import { useAuthStore } from "./store/useAuthStore.js";

// Setup Axios Interceptors with Zustand Store
setupInterceptors(
  () => useAuthStore.getState().token,
  useAuthStore.getState().setToken,
  useAuthStore.getState().setUser
);

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none font-bold",
          style: {
            background: "#fff",
            color: "#000",
          },
        }}
      />
    </BrowserRouter>
  </>
);
