"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import SubHeader from "@/components/Header/SubHeader";
import Footer from "@/components/Footer/Footer";
import { authService } from "../services/public/auth.service";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

export default function Reset() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await authService.reset(
        String(token),
        data.newPassword,
        data.confirmPassword
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Password reset successfully");
        reset();
        router.push("/login");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message?.[0] || "Failed to reset password"
      );
    }
  };

  const newPasswordValue = watch("newPassword");

  return (
    <>
      <div className="overflow-x-hidden">
        <div className="sticky top-0 z-50 w-full bg-white shadow-lg transition-transform duration-300 ease-in-out">
          <SubHeader />
        </div>

        <div className="container relative flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:py-12">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/assets/background_login.png"
              alt="Background"
              width={1920}
              height={1080}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="relative z-10 mb-6 text-center sm:mb-8">
            <h3 className="mb-1 text-3xl font-semibold text-gray-900 sm:text-4xl">
              Reset Password
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-soft-gray">
              <span className="relative after:content-['•'] after:mx-2 after:text-soft-gray">
                Home
              </span>
              <span>Reset Password</span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md px-6 py-8 overflow-hidden bg-white shadow-lg rounded-xl sm:max-w-lg">
            <h2 className="mb-1 text-xl font-semibold text-center sm:text-2xl">
              Reset Password
            </h2>
            <p className="mb-5 text-sm text-center text-gray-500 sm:mb-6">
              Enter your new password and confirm password to complete
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* New Password */}
              <div className="mb-4 sm:mb-5">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    label="Your New Password"
                    {...register("newPassword", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={`${
                      errors.newPassword ? "border-red-400 ring-red-200" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute text-gray-400 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="text-red-500 text-xs mt-1.5">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4 sm:mb-5">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    label="Your Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === newPasswordValue || "Passwords do not match",
                    })}
                    className={`${
                      errors.confirmPassword
                        ? "border-red-400 ring-red-200"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute text-gray-400 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1.5">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="blue"
                size="lg"
                className="w-full p-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit"}
              </Button>

              <div className="flex items-center justify-center gap-2 my-8 text-md sm:mb-6">
                <label>Remember Password?</label>
                <Link href="/login">
                  <p className="text-electric-blue font-semibold">Login</p>
                </Link>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
      <Toaster />
    </>
  );
}
