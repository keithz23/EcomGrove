import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { authService } from "@/app/services/public/auth.service";
import { IUserSignup } from "@/app/types/user/user.interface";
import { AuthResponse, User } from "@/app/types/auth/auth.inteface";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  user: User | null;
  isAdmin: boolean;

  signup: (formData: IUserSignup) => Promise<AuthResponse | void>;
  login: (email: string, password: string) => Promise<AuthResponse | void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      hasCheckedAuth: false,
      user: null,
      isAdmin: false,

      signup: async (formData) => {
        set({ isLoading: true });
        try {
          const response = await authService.signup(formData);
          set({ isLoading: false });
          return response.data as AuthResponse;
        } catch (error: unknown) {
          set({ isLoading: false });
          if (error instanceof AxiosError && error.message) {
            toast.error(error.response?.data.message);
          } else {
            toast.error("Signup failed");
          }
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const response = await authService.login(email, password);
          const user = response.data.data.user;

          set({
            isAuthenticated: true,
            user,
            isAdmin: user.roles.includes("admin"),
            isLoading: false,
          });

          return response.data as AuthResponse;
        } catch (error: unknown) {
          set({ isLoading: false });

          const message =
            error instanceof AxiosError && error.response?.data?.message
              ? error.response.data.message
              : "Something went wrong";

          toast.error(message);
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            hasCheckedAuth: true,
          });
          toast.success("Logout successfully");
        } catch (error: unknown) {
          set({ isLoading: false });
          if (error instanceof AxiosError && error.response) {
            toast.error(error.response?.data || error.message);
          } else {
            toast.error("Logout failed");
          }
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await authService.checkAuth();
          set({
            isAuthenticated: response.data.isAuthenticated,
            user: response.data.user,
            hasCheckedAuth: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            hasCheckedAuth: true,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-status",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
