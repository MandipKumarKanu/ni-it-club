import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from navigation state or search params
  const emailFromState =
    location.state?.email || searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailFromState,
    },
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email: emailFromState || data.email,
        otp: data.otp,
        password: data.password,
      });
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ni-neon p-4">
      <div className="bg-white border-brutal shadow-brutal-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center uppercase">
          Reset Password
        </h1>

        {message && (
          <div className="bg-green-100 border-2 border-green-500 text-green-800 px-4 py-3 font-bold mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-800 px-4 py-3 font-bold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!emailFromState && (
            <Input
              label="Email Address"
              type="email"
              {...register("email", { required: "Email is required" })}
              error={errors.email}
            />
          )}

          {emailFromState && (
            <div className="bg-gray-50 border-2 border-gray-300 p-4">
              <p className="text-sm font-bold text-gray-600 mb-1">
                Email Address
              </p>
              <p className="font-bold text-lg">{emailFromState}</p>
            </div>
          )}

          <Input
            label="OTP"
            placeholder="Enter 6-digit OTP"
            {...register("otp", { required: "OTP is required" })}
            error={errors.otp}
          />

          <Input
            label="New Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password}
          />

          <Input
            label="Confirm New Password"
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => {
                if (watch("password") != val) {
                  return "Your passwords do not match";
                }
              },
            })}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
