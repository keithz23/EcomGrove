import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/useAuthStore";
import SubHeader from "../../components/common/SubHeader";
import Loading from "../../components/common/Loading";
import { Toaster } from "react-hot-toast";
import backgroundLogin from "../../assets/background_login.png";
import Footer from "../../components/common/Footer";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type FormValues = {
  email: string;
  password: string;
};

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const ggLogin = useAuthStore((state) => state.ggLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await login(data.email, data.password);
  };

  const handleLogin = async (credentialResponse: any) => {
    await ggLogin(credentialResponse);
  };

  return (
    <div className="overflow-x-hidden">
      <div className="sticky top-0 z-50 bg-white w-full transform transition-all duration-300 shadow-lg">
        <SubHeader />
      </div>

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
            My Account
          </h3>
          <div className="flex justify-center items-center text-sm text-[#a8acb0] gap-2">
            <span className="relative after:content-['•'] after:mx-2 after:text-[#a8acb0]">
              Home
            </span>
            <span>My Account</span>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl px-6 py-8 w-full max-w-md sm:max-w-lg relative z-10 overflow-hidden">
          <h2 className="text-center text-xl font-semibold mb-1 sm:text-2xl">
            Login to EcomGrove
          </h2>
          <p className="text-center text-sm text-gray-500 mb-5 sm:mb-6">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Create a free account
            </a>
          </p>

          <div className="flex justify-center mb-4 sm:mb-5">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => alert("Login failed")}
              text="continue_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="280"
              context="signin"
            />
          </div>

          <div className="text-center text-sm text-gray-400 mb-4 sm:mb-5">
            or Sign in with Email
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-1.5">
                Your Email
              </label>
              <input
                type="email"
                placeholder="ecomgrove@mail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  errors.email
                    ? "border-red-400 ring-red-200"
                    : "border-gray-300 focus:ring-blue-400"
                } transition-colors`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1.5">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="mb-4 sm:mb-5">
              <label className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                    errors.password
                      ? "border-red-400 ring-red-200"
                      : "border-gray-300 focus:ring-blue-400"
                  } transition-colors`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1.5">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-sm mb-5 sm:mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#0989ff] border-gray-300 rounded"
                />
                Remember me
              </label>
              <a href="#" className="text-[#0989ff] hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-[#0989ff] transition-colors text-sm font-medium disabled:bg-gray-500 disabled:cursor-not-allowed duration-300"
            >
              {isLoading ? "Processing..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <Loading isVisible={isLoading} />
      <Toaster />
      <Footer />
    </div>
  );
};

const WrappedLogin = () => (
  <GoogleOAuthProvider clientId={clientId}>
    <Login />
  </GoogleOAuthProvider>
);

export default WrappedLogin;
