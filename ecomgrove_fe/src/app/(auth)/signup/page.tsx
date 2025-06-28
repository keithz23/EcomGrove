import Signup from "@/app/layouts/auth/SignupLayout";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
  description:
    "Signup to your EcomGrove account for seamless online shopping experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return <Signup />;
}
