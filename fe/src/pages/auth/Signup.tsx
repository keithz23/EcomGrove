import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../../styles/global-style.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "../../components/common/Loading";
import backgroundLogin from "../../assets/background_login.png";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import SubHeader from "../../components/common/SubHeader";
import Footer from "../../components/common/Footer";

type FormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export default function Signup() {
  const navigate = useNavigate();
  const { signup, ggLogin, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await signup(data);
      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      await ggLogin(credentialResponse.credential);
      toast.success("Google signup successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Google signup failed. Please try again.");
    }
  };

  const inputFields = [
    {
      name: "firstName",
      label: "First Name",
      placeHolder: "Enter your first name",
      type: "text",
      validation: {
        required: "First name is required",
        minLength: {
          value: 2,
          message: "First name must be at least 2 characters",
        },
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      placeHolder: "Enter your last name",
      type: "text",
      validation: {
        required: "Last name is required",
        minLength: {
          value: 2,
          message: "Last name must be at least 2 characters",
        },
      },
    },
    {
      name: "username",
      label: "Username",
      placeHolder: "Enter your username",
      type: "text",
      validation: {
        required: "Username is required",
        minLength: {
          value: 3,
          message: "Username must be at least 3 characters",
        },
      },
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeHolder: "Enter your phone number",
      type: "tel",
      validation: {
        required: "Phone number is required",
        pattern: {
          value: /^[0-9]{10,}$/,
          message: "Phone number must be at least 10 digits",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      placeHolder: "Enter your email",
      type: "email",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          message: "Invalid email format",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      placeHolder: "Enter your password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
        pattern: {
          value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
          message:
            "Password must contain at least one uppercase letter and one special character",
        },
      },
    },
  ] as const;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  if (!clientId) {
    console.warn(
      "Google Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in .env"
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="sticky top-0 z-50 bg-white transform transition-all duration-300 shadow-lg">
        <SubHeader />
      </div>

      <GoogleOAuthProvider clientId={clientId}>
        <div className="container relative min-h-screen flex flex-col items-center justify-center px-4 py-8 mx-auto sm:py-12">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={backgroundLogin}
              className="w-full h-full object-cover"
              alt="Background"
            />
          </div>

          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <h3 className="text-gray-900 text-3xl font-semibold mb-1 sm:text-4xl">
              My account
            </h3>
            <div className="flex justify-center items-center text-sm text-[#a8acb0] gap-2">
              <span className="relative after:content-['•'] after:mx-2 after:text-[#a8acb0]">
                Home
              </span>
              <span>Sign Up</span>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl px-6 py-8 w-full max-w-md sm:max-w-lg relative z-10">
            <h2 className="text-center text-xl font-semibold mb-1 sm:text-2xl">
              Sign Up for EcomGrove
            </h2>
            <p className="text-center text-sm text-gray-500 mb-5 sm:mb-6">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Sign In
              </a>
            </p>

            {clientId ? (
              <div className="flex justify-center mb-4 sm:mb-5">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google signup failed")}
                  text="continue_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="280"
                  context="signup"
                />
              </div>
            ) : (
              <p className="text-center text-red-500 mb-4 sm:mb-5">
                Google signup unavailable: Client ID missing
              </p>
            )}

            <div className="text-center text-sm text-gray-400 mb-4 sm:mb-5">
              or Sign up with Email
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {inputFields.map((field) => (
                <div key={field.name} className="mb-4 sm:mb-5">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium mb-1.5"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      id={field.name}
                      type={
                        field.name === "password" && showPassword
                          ? "text"
                          : field.type
                      }
                      placeholder={field.placeHolder}
                      {...register(field.name, field.validation)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                        errors[field.name]
                          ? "border-red-400 ring-red-200"
                          : "border-gray-300 focus:ring-blue-400"
                      } transition-colors`}
                    />
                    {field.name === "password" && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon size={18} />
                        ) : (
                          <EyeIcon size={18} />
                        )}
                      </button>
                    )}
                  </div>
                  {errors[field.name] && (
                    <span className="text-red-500 text-xs mt-1.5">
                      {errors[field.name]?.message}
                    </span>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-[#0989ff] transition-colors text-sm font-medium disabled:bg-gray-500 disabled:cursor-not-allowed duration-300"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
        <Loading isVisible={isLoading} />
        <Toaster />
        <Footer />
      </GoogleOAuthProvider>
    </div>
  );
}
