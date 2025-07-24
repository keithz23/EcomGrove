"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type FormValues = {
  email: string;
  password: string;
};

const AdminLoginLayout = () => {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  useEffect(() => {
    if (isAdmin && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAdmin, isAuthenticated, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await login(data.email, data.password);
    if (!res) return;

    if (!res.data.user.roles.includes("admin")) {
      toast.error("You do not have permission to access admin area.", {
        id: "no-admin-access",
      });
      return;
    }

    toast.success("Login successfully");
    setIsAdmin(true);

    router.push("/admin/dashboard");
  };

  return (
    <>
      <div className="overflow-x-hidden">
        <div className="w-full relative flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:py-12">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          </div>

          <div className="relative z-10 mb-6 text-center sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheckIcon className="w-12 h-12 text-red-500 mr-3" />
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                Admin Portal
              </h3>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
              <span className="relative after:content-['•'] after:mx-2 after:text-gray-300">
                Home
              </span>
              <span>Admin Login</span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md px-8 py-10 overflow-hidden bg-white shadow-2xl rounded-2xl sm:max-w-lg border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <ShieldCheckIcon className="w-8 h-8 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl">
                Admin Access
              </h2>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 text-center">
                <span className="font-semibold">Restricted Access:</span> This
                area is for authorized administrators only.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <Input
                  type="email"
                  id="email"
                  label="Admin Email"
                  {...register("email", {
                    required: "Admin email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className={`${
                    errors.email
                      ? "border-red-400 ring-red-200"
                      : "border-gray-300 focus:border-red-500 focus:ring-red-200"
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1.5">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    label="Admin Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Admin password must be at least 8 characters",
                      },
                    })}
                    className={`${
                      errors.password
                        ? "border-red-400 ring-red-200"
                        : "border-gray-300 focus:border-red-500 focus:ring-red-200"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute text-gray-400 hover:text-gray-600 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1.5">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant={"red"}
                className="p-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Access Admin Panel
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Need admin access? Contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginLayout;
