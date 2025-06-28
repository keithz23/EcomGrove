import { Facebook, Instagram, TwitchIcon } from "lucide-react";

export type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const formFields = [
  {
    name: "name" as keyof FormValues,
    label: "Your Name",
    type: "text",
    validation: {
      required: "Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
    },
  },
  {
    name: "email" as keyof FormValues,
    label: "Your Email",
    type: "email",
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    },
  },
  {
    name: "subject" as keyof FormValues,
    label: "Subject",
    type: "text",
    validation: {
      required: "Subject is required",
      minLength: {
        value: 4,
        message: "Subject must be at least 4 characters",
      },
    },
  },
  {
    name: "message" as keyof FormValues,
    label: "Your Message",
    type: "textarea",
    validation: {
      required: "Message is required",
      minLength: {
        value: 10,
        message: "Message must be at least 10 characters",
      },
    },
  },
];

export const SocialItem = [
  {
    id: 1,
    name: "Facebook",
    icon: (
      <Facebook className="text-mid-night group-hover:text-white font-semibold h-5 w-5" />
    ),
  },
  {
    id: 2,
    name: "Instagram",
    icon: (
      <Instagram className="text-mid-night group-hover:text-white font-semibold h-5 w-5" />
    ),
  },
  {
    id: 3,
    name: "Linked In",
    icon: (
      <TwitchIcon className="text-mid-night group-hover:text-white font-semibold h-5 w-5" />
    ),
  },
];
