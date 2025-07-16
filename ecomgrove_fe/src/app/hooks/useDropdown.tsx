import { useEffect, useRef, useState } from "react";

export default function useDropdown() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const isOpen = (key: string) => openDropdown === key;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return { openDropdown, toggle, isOpen, dropdownRef };
}
