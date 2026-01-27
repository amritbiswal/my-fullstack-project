import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginForm } from "./authSchemas";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function LoginPage() {
  const nav = useNavigate();
  const { toast } = useToast();
  const { user, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  useEffect(() => {
    if (user) nav("/app/trip", { replace: true });
  }, [user, nav]);

  async function onSubmit(values: LoginForm) {
    try {
      await login(values.email, values.password);
      toast("Welcome back");
      nav("/app/trip", { replace: true });
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Login failed", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[560px] min-h-screen bg-white px-4 py-10">
        <div className="mb-6">
          <div className="text-2xl font-semibold text-slate-900">Login</div>
          <div className="mt-1 text-sm text-slate-600">
            Access Packless to rent items at your destination.
          </div>
        </div>

        <Card className="p-4">
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              placeholder="anna@test.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm text-slate-600">
              New to Packless?{" "}
              <Link to="/register" className="font-medium text-teal-700 hover:underline">
                Create account
              </Link>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-xs text-slate-500 text-center">
          By continuing, you agree to Packless policies.
        </div>
      </div>
    </div>
  );
}
