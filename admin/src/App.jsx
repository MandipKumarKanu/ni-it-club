import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
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
import SubscribersList from "./pages/Newsletter/SubscribersList";
import ComposeNewsletter from "./pages/Newsletter/ComposeNewsletter";
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
      if (!token) {
        try {
          const { data } = await axios.post(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:5000/api"
            }/auth/refresh`,
            {},
            { withCredentials: true }
          );
          const { accessToken } = data;
          const decodedUser = jwtDecode(accessToken);
          setToken(accessToken);

          try {
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
            const storedUser = localStorage.getItem("niit_admin_user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          console.log("Session expired or invalid");
          setToken(null);
          setUser(null);
          localStorage.removeItem("niit_admin_user");
        }
      } else {
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
        <Route path="newsletter" element={<SubscribersList />} />
        <Route path="newsletter/compose" element={<ComposeNewsletter />} />
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
