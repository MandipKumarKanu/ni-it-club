import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";

const ChangePassword = ({ embedded = false }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });

      // Update local user state to reflect isFirstLogin: false
      const updatedUser = { ...user, isFirstLogin: false };
      setUser(updatedUser);
      localStorage.setItem("niit_admin_user", JSON.stringify(updatedUser));

      if (embedded) {
        setSuccess("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const containerClass = embedded
    ? "bg-white"
    : "min-h-screen flex items-center justify-center bg-gray-100";

  const cardClass = embedded
    ? "w-full"
    : "bg-white p-8 rounded-lg shadow-md w-full max-w-md";

  return (
    <div
      className={
        embedded
          ? ""
          : "min-h-screen flex items-center justify-center bg-ni-neon p-4"
      }
    >
      <div
        className={
          embedded
            ? "w-full"
            : "bg-white border-brutal shadow-brutal-lg p-8 w-full max-w-md"
        }
      >
        {!embedded && (
          <h2 className="text-3xl font-bold mb-6 text-center uppercase">
            Change Password
          </h2>
        )}
        {user?.isFirstLogin && !embedded && (
          <div className="bg-ni-neon border-4 border-black text-black p-4 mb-6 font-bold">
            <p className="text-lg">⚠️ First time login detected!</p>
            <p className="mt-2">
              You must change your password to continue using the admin panel.
            </p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-ni-neon"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 px-4 hover:bg-gray-800 transition-all disabled:opacity-50 border-4 border-black"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
