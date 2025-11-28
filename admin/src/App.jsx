import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import api from "./services/api"; // Ensure interceptors are active
import axios from "axios";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventsList from "./pages/Events/EventsList";
import GalleryList from "./pages/Gallery/GalleryList";
import ProjectsList from "./pages/Projects/ProjectsList";
import TeamList from "./pages/Team/TeamList";
import ContactList from "./pages/Contact/ContactList";
import Settings from "./pages/Settings/Settings";
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
          // We can't get name/email from token if it's not there.
          // Let's assume the user needs to login again if we can't get full profile,
          // OR we implement /me.
          // Let's implement a quick /me call or just decode what we have.
          // Actually, the user's snippet uses `jwtDecode(token)` to get user.
          // My backend `generateToken` puts `userId` and `role` in token.
          // It does NOT put name/email.
          // So I should probably fetch the user details.
          // But I don't have a /me endpoint.
          // I'll add a simple fetch to get user details if token exists.
          // Or just rely on the fact that if refresh works, we are good.
          // But the UI needs `user.name`.
          // Let's add a `fetchProfile` to store or just use a placeholder.
          // Better: Add /me endpoint to backend?
          // Or just store user in localStorage as I did before?
          // The user's snippet uses `jwtDecode(token).user`.
          // My token payload is `{ userId, role }`.
          // I will use localStorage for user details for now to persist name/email across refreshes,
          // combined with the cookie for security.
          const storedUser = localStorage.getItem("niit_admin_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          // Refresh failed, user needs to login
          console.log("Session expired or invalid");
        }
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
      </Route>
    </Routes>
  );
}

export default App;
