import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterForm } from "./authSchemas";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function RegisterPage() {
  const nav = useNavigate();
  const { toast } = useToast();
  const { user, register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "TOURIST"
    }
  });

  useEffect(() => {
    if (user) nav("/app/trip", { replace: true });
  }, [user, nav]);

  const role = watch("role");

  async function onSubmit(values: RegisterForm) {
    try {
      await registerUser({
        name: values.name,
        email: values.email?.trim(),
        password: values.password,
        role: values.role
      });
      toast("Account created");
      nav("/app/trip", { replace: true });
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Registration failed", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[560px] min-h-screen bg-white px-4 py-10">
        <div className="mb-6">
          <div className="text-2xl font-semibold text-slate-900">Create account</div>
          <div className="mt-1 text-sm text-slate-600">
            Start renting verified items without carrying luggage.
          </div>
        </div>

        <Card className="p-4">
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full name"
              placeholder="Anna Müller"
              error={errors.name?.message}
              {...register("name")}
            />

            <div className="grid grid-cols-1 gap-3">
              <Input
                label="Email"
                placeholder="anna@test.com"
                error={errors.email?.message as string | undefined}
                {...register("email")}
              />
              {/* {(errors.email?.message || (errors as any)?.root?.message) && (
                <div className="text-xs text-red-600">{errors.email?.message as any}</div>
              )} */}
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-700">Account type</div>
              <div className="grid grid-cols-3 gap-2">
                <RoleButton selected={role === "TOURIST"} onClick={() => (document.querySelector('input[value="TOURIST"]') as HTMLInputElement)?.click()}>
                  Tourist
                </RoleButton>
                <RoleButton
                  selected={role === "PROVIDER_INDIVIDUAL"}
                  onClick={() =>
                    (document.querySelector('input[value="PROVIDER_INDIVIDUAL"]') as HTMLInputElement)?.click()
                  }
                >
                  Provider
                </RoleButton>
                <RoleButton
                  selected={role === "PROVIDER_BUSINESS"}
                  onClick={() =>
                    (document.querySelector('input[value="PROVIDER_BUSINESS"]') as HTMLInputElement)?.click()
                  }
                >
                  Business
                </RoleButton>
              </div>

              {/* Hidden radios to keep RHF simple and typed */}
              <div className="hidden">
                <label>
                  <input type="radio" value="TOURIST" {...register("role")} />
                </label>
                <label>
                  <input type="radio" value="PROVIDER_INDIVIDUAL" {...register("role")} />
                </label>
                <label>
                  <input type="radio" value="PROVIDER_BUSINESS" {...register("role")} />
                </label>
              </div>
              {errors.role?.message && <div className="text-xs text-red-600">{errors.role.message}</div>}
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create account"}
            </Button>

            <div className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-teal-700 hover:underline">
                Login
              </Link>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-xs text-slate-500 text-center">
          By creating an account, you agree to Packless policies.
        </div>
      </div>
    </div>
  );
}

function RoleButton({
  selected,
  onClick,
  children
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-xl border px-3 text-sm font-medium transition ${
        selected ? "border-teal-300 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
