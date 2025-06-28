import React from "react";
import type { LucideIcon } from "lucide-react";

export const SidebarItem: React.FC<{
  icon: LucideIcon;
  text: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}> = ({ icon: Icon, text, active, collapsed, onClick }) => {
  return (
    <div
      className={`flex items-center py-3 px-4 cursor-pointer ${
        active ? "bg-indigo-700" : "hover:bg-indigo-700"
      } transition-colors duration-200 ${collapsed ? "justify-center" : ""}`}
      onClick={onClick}
    >
      <Icon
        className={`${
          active ? "text-white" : "text-indigo-300"
        } ${collapsed ? "w-6 h-6" : "w-5 h-5"}`}
      />
      {!collapsed && (
        <span className={`ml-3 ${active ? "font-medium" : ""}`}>{text}</span>
      )}
    </div>
  );
};
