import { create } from "zustand";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AuthResponse, User } from "@/app/types/auth/auth.inteface";
import { IUserSignup } from "@/app/types/user/user.interface";
import { authService } from "@/app/services/public/auth.service";
import { NextRequest } from "next/server";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  accessToken: string | null;
  hasCheckedAuth: boolean;

  signup: (formData: IUserSignup) => Promise<AuthResponse | void>;
  login: (email: string, password: string) => Promise<AuthResponse | void>;
  logout: () => Promise<void>;
  profile: () => Promise<unknown>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<string | null>;

  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  accessToken: null,
  hasCheckedAuth: false,

  setAccessToken: (token: string) => set({ accessToken: token }),

  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await authService.signup(formData);
      set({ isLoading: false });
      toast.success("Signup successful");
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

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const response = await authService.login(email, password);
      const user = response.data.user;
      const accessToken = response.data.accessToken;
      const isAdmin = user.roles.includes("admin");
      console.log(response)

      set({
        user,
        isAdmin,
        isAuthenticated: true,
        accessToken,
        isLoading: false,
      });

      toast.success("Login successful");
      return response as AuthResponse;
    } catch (error: unknown) {
      set({ isLoading: false });
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        accessToken: null,
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

  profile: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.profile();
      set({
        user: response.data.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      toast.error("Failed to load profile");
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.checkAuth();
      const user = response.data.user;
      const isAdmin = user?.roles.includes("admin") ?? false;
      const isAuthenticated = response.data.isAuthenticated;

      set({
        user: user || null,
        isAdmin,
        isAuthenticated,
        isLoading: false,
        hasCheckedAuth: true,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasCheckedAuth: true,
      });
    }
  },

  refreshToken: async () => {
    try {
      const response = await authService.refresh();
      const accessToken = response.data.accessToken;
      set({ accessToken });
      return accessToken;
    } catch (error) {
      set({
        accessToken: null,
        isAuthenticated: false,
        user: null,
        isAdmin: false,
      });
      return null;
    }
  },
}));
