import { BadgePercent, DollarSign, Headphones, Truck } from "lucide-react";

export const AdSectionData = [
  {
    id: 1,
    title: "Free Delivery",
    desc: "Orders from all items",
    icon: <Truck className="h-12 w-12 text-pink-vibe" />,
  },
  {
    id: 2,
    title: "Return & Refund",
    desc: "Money back guarantee",
    icon: <DollarSign className="h-12 w-12 text-pink-vibe" />,
  },
  {
    id: 3,
    title: "Member Discount",
    desc: "On every order order $140.00",
    icon: <BadgePercent className="h-12 w-12 text-pink-vibe" />,
  },
  {
    id: 4,
    title: "Support 24/7",
    desc: "Contact us 24 hours a day",
    icon: <Headphones className="h-12 w-12 text-pink-vibe" />,
  },
];
