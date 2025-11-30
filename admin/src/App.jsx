import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import api from "./services/api"; // Ensure interceptors are active
import axios from "axios";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import EventsList from "./pages/Events/EventsList";
import GalleryList from "./pages/Gallery/GalleryList";
import ProjectsList from "./pages/Projects/ProjectsList";
import TeamList from "./pages/Team/TeamList";
import ContactList from "./pages/Contact/ContactList";
import Settings from "./pages/Settings/Settings";
import UsersList from "./pages/Users/UsersList";
import UserForm from "./pages/Users/UserForm";
import Logs from "./pages/Logs/Logs";
import ChangePassword from "./pages/Auth/ChangePassword";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { token, setToken, setUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Try to refresh token on app load if we don't have one but might have a cookie
      if (!token) {
        try {
          // Use global axios to avoid interceptor loop
          const { data } = await axios.post(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:5000/api"
            }/auth/refresh`,
            {},
            { withCredentials: true }
          );
          const { accessToken } = data;
          const decodedUser = jwtDecode(accessToken);
          // Ideally we should fetch full user profile here if needed,
          // but for now let's assume we can proceed or fetch profile.
          // Let's try to fetch profile or just use decoded info?
          // My backend doesn't have a /me endpoint yet.
          // Let's just set the token. The interceptor handles the rest for requests.
          // But we need 'user' in store for UI.
          // Let's decode the token to get basic info (id, role).
          // If we need name/email, we should add a /me endpoint or store it in localStorage.
          // For now, let's just set token.
          setToken(accessToken);

          // Fetch fresh user profile to ensure permissions are up to date
          try {
            // We need to use the token we just got.
            // Since api interceptor might not have picked it up yet (state update is async),
            // we can use axios directly or rely on api if we set the header manually or wait.
            // But simpler: just use axios with the new token.
            const userResponse = await axios.get(
              `${
                import.meta.env.VITE_API_URL || "http://localhost:5000/api"
              }/auth/me`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            const freshUser = userResponse.data;
            setUser(freshUser);
            localStorage.setItem("niit_admin_user", JSON.stringify(freshUser));
          } catch (profileError) {
            console.error("Failed to fetch profile", profileError);
            // Fallback to local storage if fetch fails
            const storedUser = localStorage.getItem("niit_admin_user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          // Refresh failed, user needs to login
          console.log("Session expired or invalid");
          setToken(null);
          setUser(null);
          localStorage.removeItem("niit_admin_user");
        }
      } else {
        // Token exists in state (rare on reload, but possible if navigating)
        // We should still maybe refresh profile?
        // For now, let's assume if token is in state, user is also in state.
      }
      setIsChecking(false);
    };

    initAuth();
  }, [token, setToken, setUser]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-xl">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/change-password"
        element={token ? <ChangePassword /> : <Navigate to="/login" />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="events" element={<EventsList />} />
        <Route path="gallery" element={<GalleryList />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="team" element={<TeamList />} />
        <Route path="contact" element={<ContactList />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<UsersList />} />
        <Route path="users/new" element={<UserForm />} />
        <Route path="users/:id" element={<UserForm />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}

export default App;
