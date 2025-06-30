"use client";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { ReactNode, useEffect, useState } from "react";
import { Loading } from "../loading/Loading";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const { checkAuth, isLoading } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasHydrated(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      checkAuth();
    }
  }, [hasHydrated]);

  if (!hasHydrated || isLoading) {
    return <Loading fullscreen size={"large"} />;
  }

  return <>{children}</>;
};
