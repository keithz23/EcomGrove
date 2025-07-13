"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Footer from "@/components/Footer/Footer";
import SubHeader from "@/components/Header/SubHeader";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWindowEvents } from "@/app/hooks/useWindowsEvent";
import { AuthResponse } from "@/app/types/auth/auth.inteface";

type FormValues = {
  email: string;
};

const ForgotLayout = () => {
  const router = useRouter();
  const isLoading = useAuthStore((state) => state.isLoading);
  const { isScrolledY } = useWindowEvents();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {};

  return (
    <>
      <div className="overflow-x-hidden">
        <div
          className={`bg-white transition-all duration-300 ease-in-out ${
            isScrolledY
              ? "fixed shadow-md opacity-100 top-0 w-full z-20"
              : "sticky shadow-sm opacity-95"
          }`}
        >
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
              My Account
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-soft-gray">
              <span className="relative after:content-['•'] after:mx-2 after:text-soft-gray">
                Home
              </span>
              <span>Forgot Password</span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md px-6 py-8 overflow-hidden bg-white shadow-lg rounded-xl sm:max-w-lg">
            <h2 className="mb-1 text-xl font-semibold text-center sm:text-2xl">
              Login to EcomGrove
            </h2>
            <p className="mb-5 text-sm text-center text-gray-500 sm:mb-6">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-electric-blue hover:underline"
              >
                Create a free account
              </Link>
            </p>

            <div className="mb-4 text-sm text-center text-gray-400 sm:mb-5">
              or Sign in with Email
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 sm:mb-5">
                <Input
                  type="email"
                  id="email"
                  label="Your Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className={`${
                    errors.email ? "border-red-400 ring-red-200" : ""
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1.5">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mb-5 text-sm sm:mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded text-primary"
                  />
                  Remember me
                </label>
                <Link href="/forgot" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                variant={"blue"}
                size={"lg"}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ForgotLayout;
