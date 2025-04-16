import { useState } from "react";

export default function ProfileTest() {
  const [isActive, setIsActive] = useState<string | null>("Profile");

  const handleActiveTab = (tab: string) => {
    setIsActive(tab);
  };

  return (
    <div className="h-screen container flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10">
        <div className="w-96 border border-gray-200 shadow-xl min-h-72">
          <ul className="text-xl space-y-8">
            <li
              className={`${
                isActive === "Profile" ? "bg-[#0989ff0f] text-[#0989ff]" : ""
              } p-5 hover:cursor-pointer`}
              onClick={() => handleActiveTab("Profile")}
            >
              Profile
            </li>
            <li
              className={`${
                isActive === "Information"
                  ? "bg-[#0989ff0f] text-[#0989ff]"
                  : ""
              } p-5 hover:cursor-pointer`}
              onClick={() => handleActiveTab("Information")}
            >
              Information
            </li>
            <li
              className={`${
                isActive === "Address" ? "bg-[#0989ff0f] text-[#0989ff]" : ""
              } p-5 hover:cursor-pointer`}
              onClick={() => handleActiveTab("Address")}
            >
              Address
            </li>
            <li
              className={`${
                isActive === "My Orders" ? "bg-[#0989ff0f] text-[#0989ff]" : ""
              } p-5 hover:cursor-pointer`}
              onClick={() => handleActiveTab("My Orders")}
            >
              My Orders
            </li>
            <li
              className={`${
                isActive === "Change Password"
                  ? "bg-[#0989ff0f] text-[#0989ff]"
                  : ""
              } p-5 hover:cursor-pointer`}
              onClick={() => handleActiveTab("Change Password")}
            >
              Change Password
            </li>
          </ul>
        </div>
        <div className="col-span-2 w-full">
          <div className="border border-gray-300 shadow-md p-5">
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 p-4 relative">
                <div className="flex flex-col gap-y-3">
                  <img
                    src={``}
                    alt="profile picture"
                    className="border rounded-full h-16 w-16"
                  />
                  <span className="text-xl font-semibold">
                    Welcome Mr. Admin!
                  </span>
                </div>
                <div className="absolute right-5 top-1/4">
                  <button className="px-3 py-2 border border-gray-300">
                    Logout
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-10 border border-gray-400">1</div>
                <div className="p-10 border border-gray-400">1</div>
                <div className="p-10 border border-gray-400">1</div>
                <div className="p-10 border border-gray-400">1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
