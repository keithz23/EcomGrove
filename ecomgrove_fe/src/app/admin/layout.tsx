"use client";
import { useAuthStore } from "../store/auth/useAuthStore";
import { Loading } from "@/components/loading/Loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasCheckedAuth, isLoading } = useAuthStore();

  if (!hasCheckedAuth || isLoading) {
    return <Loading fullscreen size={"large"} />;
  }

  return <>{children}</>;
}
