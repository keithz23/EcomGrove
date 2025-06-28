"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth/useAuthStore";
import { Loading } from "@/components/loading/Loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, checkAuth, hasCheckedAuth, isLoading } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasCheckedAuth) checkAuth();
  }, [hasCheckedAuth]);

  useEffect(() => {
    if (hasCheckedAuth && (!isAuthenticated || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [hasCheckedAuth, isAuthenticated, isAdmin, router]);

  if (!hasCheckedAuth || isLoading) {
    return <Loading fullscreen size={"large"} />;
  }

  return <>{children}</>;
}
