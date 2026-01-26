import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Valid email required").optional(),
  phone: z.string().min(5, "Phone required").optional(),
  password: z.string().min(6, "Password required"),
  role: z.enum(["TOURIST", "PROVIDER_INDIVIDUAL", "PROVIDER_BUSINESS"]),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setServerError("");
    try {
      await registerUser(data);
      navigate("/");
    } catch (err: any) {
      setServerError(err?.response?.data?.error?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <form
        className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold text-center mb-2">Register</h2>
        <div>
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <select {...register("role")} className="input input-bordered w-full">
            <option value="">Select role</option>
            <option value="TOURIST">Tourist</option>
            <option value="PROVIDER_INDIVIDUAL">Provider Individual</option>
            <option value="PROVIDER_BUSINESS">Provider Business</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
        </div>
        {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
        <div className="text-center text-sm mt-2">
          <a href="/login" className="text-blue-600 underline">Already have an account?</a>
        </div>
      </form>
    </div>
  );
}