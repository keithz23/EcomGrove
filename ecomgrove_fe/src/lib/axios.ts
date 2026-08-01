import axios from "axios";

const API =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_LOCAL
    : process.env.NEXT_PUBLIC_API_PROD;

export const instance = axios.create({
  baseURL: API,
  withCredentials: true,
});

let refreshRequest: Promise<void> | null = null;

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.endsWith("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshRequest ??= instance.post("/auth/refresh").then(() => undefined);

    try {
      await refreshRequest;
      return instance(originalRequest);
    } finally {
      refreshRequest = null;
    }
  }
);
