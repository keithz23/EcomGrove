import { useState } from "react";

export default function useDropdown() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) =>
    setOpenDropdown((prev) => (prev === key ? null : key));
  const isOpen = (key: string) => openDropdown === key;
  return { openDropdown, toggle, isOpen };
}
