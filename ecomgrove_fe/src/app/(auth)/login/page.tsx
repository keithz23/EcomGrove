import LoginLayout from "@/app/layouts/auth/LoginLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to your EcomGrove account for seamless online shopping experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginLayout />;
}
