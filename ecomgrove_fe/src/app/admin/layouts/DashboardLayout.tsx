"use client";
import useDropdown from "@/app/hooks/useDropdown";
import { useAuthStore } from "@/app/store/auth/useAuthStore";
import { DashboardContent } from "@/components/admin/dashboard/DashboardContent";
import { SidebarItem } from "@/components/admin/dashboard/SidebarComponents";
import { RoleContent } from "@/components/admin/permissions/RoleContent";
import { UsersContent } from "@/components/admin/users/UserContent";
import {
  Bell,
  ChartLine,
  ChevronLeft,
  ChevronRight,
  Cog,
  Gauge,
  LogOut,
  Package2,
  Search,
  Shield,
  Store,
  Tags,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { toggle, isOpen } = useDropdown();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-indigo-800 text-white transition-all duration-300 ease-in-out fixed h-full z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          <div
            className={`flex items-center ${
              !sidebarOpen ? "justify-center w-full" : ""
            }`}
          >
            <Store className="text-2xl" />
            {sidebarOpen && (
              <span className="ml-3 text-xl font-semibold">Ecomgrove</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-2 text-white cursor-pointer !rounded-button"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="mt-5">
          <SidebarItem
            icon={Gauge}
            text="Dashboard"
            active={activeTab === "dashboard"}
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem
            icon={Users}
            text="Users"
            active={activeTab === "users"}
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab("users")}
          />

          <SidebarItem
            icon={Shield}
            text="Roles & Permissions"
            active={activeTab === "roles & permissions"}
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab("roles & permissions")}
          />

          <SidebarItem
            icon={Package2}
            text="Products"
            active={activeTab === "products"}
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab("products")}
          />
          <SidebarItem
            icon={Tags}
            text="Categories"
            active={activeTab === "categories"}
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab("categories")}
          />
          <SidebarItem
            icon={ChartLine}
            text="Analytics"
            active={activeTab === "analytics"}
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab("analytics")}
          />
          <SidebarItem
            icon={Cog}
            text="Settings"
            active={activeTab === "settings"}
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab("settings")}
          />
        </nav>
      </div>

      <div
        className={`flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Top Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab}
            </h1>
            <div className="ml-4 text-sm text-gray-500 hidden md:block">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span className="capitalize">{activeTab}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-indigo-600 cursor-pointer !rounded-button whitespace-nowrap">
              <Bell className="text-xl" />
              <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </span>
            </button>
            <div className="relative">
              <button
                aria-haspopup="true"
                aria-expanded={isOpen("admin")}
                aria-controls="admin-dropdown"
                onClick={() => toggle("admin")}
              >
                <div className="flex items-center cursor-pointer">
                  <img
                    src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20business%20person%20with%20a%20friendly%20smile%2C%20high%20quality%20portrait%20photo%20with%20neutral%20background%2C%20professional%20lighting&width=40&height=40&seq=1&orientation=squarish"
                    alt="User"
                    className="h-10 w-10 rounded-full object-cover object-top"
                  />
                  <div className="ml-2 hidden md:block">
                    <p className="text-sm font-medium text-gray-700">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
              </button>

              <ul
                id="admin-dropdown"
                role="menu"
                className={`absolute right-0 bg-white text-black shadow-lg mt-2 min-w-max text-xs sm:text-sm rounded transition-all duration-200 z-50 ${
                  isOpen("admin")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <button
                  className="flex items-center w-full gap-1 px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </ul>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="p-6">
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "users" && <UsersContent />}
          {activeTab === "roles & permissions" && <RoleContent />}
          {activeTab === "products" && (
            <div className="h-[900px] flex items-center justify-center text-2xl text-gray-500">
              Product content coming soon
            </div>
          )}
          {activeTab === "categories" && (
            <div className="h-[900px] flex items-center justify-center text-2xl text-gray-500">
              Categories content coming soon
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="h-[900px] flex items-center justify-center text-2xl text-gray-500">
              Analytics content coming soon
            </div>
          )}
          {activeTab === "settings" && (
            <div className="h-[900px] flex items-center justify-center text-2xl text-gray-500">
              Settings content coming soon
            </div>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
