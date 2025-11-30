import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setMessage("OTP sent to your email. Please check your inbox.");

      // Navigate to reset password page with email in state after 1.5 seconds
      setTimeout(() => {
        navigate("/reset-password", { state: { email: data.email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ni-neon p-4">
      <div className="bg-white border-brutal shadow-brutal-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center uppercase">
          Forgot Password
        </h1>

        {message ? (
          <div className="text-center space-y-6">
            <div className="bg-green-100 border-2 border-green-500 text-green-800 px-4 py-3 font-bold">
              {message}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-800 px-4 py-3 font-bold">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              {...register("email", { required: "Email is required" })}
              error={errors.email}
            />

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm font-bold hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
