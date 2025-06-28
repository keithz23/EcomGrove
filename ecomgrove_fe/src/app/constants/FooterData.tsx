import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export const SocialItem = [
  {
    id: 1,
    name: "Facebook",
    icon: (
      <Facebook className="text-dark-gray group-hover:text-white font-semibold h-5 w-5" />
    ),
  },
  {
    id: 2,
    name: "Instagram",
    icon: (
      <Instagram className="text-dark-gray group-hover:text-white font-semibold h-5 w-5" />
    ),
  },
  {
    id: 3,
    name: "Linked In",
    icon: (
      <Linkedin className="text-dark-gray group-hover:text-white font-semibold h-5 w-5" />
    ),
  },
  {
    id: 4,
    name: "Gmail",
    icon: (
      <Mail className="text-dark-gray group-hover:text-white font-semibold h-5 w-5" />
    ),
  },
];

export const MyAccountItem = [
  { id: 1, name: "Track Orders" },
  { id: 2, name: "Shipping" },
  { id: 3, name: "Wishlist" },
  { id: 4, name: "My Account" },
  { id: 5, name: "Order History" },
  { id: 6, name: "Returns" },
];

export const InformationItem = [
  { id: 1, name: "Our Story" },
  { id: 2, name: "Careers" },
  { id: 3, name: "Privacy Policy" },
  { id: 4, name: "Terms & Conditions" },
  { id: 5, name: "Latest News" },
  { id: 6, name: "Contact Us" },
];
