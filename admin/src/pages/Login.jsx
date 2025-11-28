import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      // Persist user details for UI (since token only has ID/Role)
      // The store update happens in login()
      // We also need to save to localStorage to persist name/email on refresh
      // Access store state to get the user that was just set
      const user = useAuthStore.getState().user;
      localStorage.setItem("niit_admin_user", JSON.stringify(user));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ni-neon p-4">
      <div className="bg-white border-brutal shadow-brutal-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={errors.password}
          />

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
