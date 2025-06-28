import { useAuthStore } from "@/app/store/auth/useAuthStore";
import axios from "axios";

const API =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_LOCAL
    : process.env.NEXT_PUBLIC_API_PROD;

export const instance = axios.create({
  baseURL: API,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
