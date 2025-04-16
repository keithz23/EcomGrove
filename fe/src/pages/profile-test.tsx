import {
  UserPen,
  Info,
  MapPin,
  ClipboardList,
  Bell,
  Lock,
  Camera,
  Download,
  PackageOpen,
  Heart,
  Gift,
  User,
  IdCard,
  Phone,
  Mail,
} from "lucide-react";
import { JSX, useState } from "react";
import { useProfileData } from "../hooks";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ModalUpload } from "../components/common/ModalUpload";
import SubHeader from "../components/common/SubHeader";
import Footer from "../components/common/Footer";
import { InformationRow } from "../interfaces";

export default function ProfileTest() {
  const navigate = useNavigate();
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
  const { formData, updateFormData, handleChange, isGoogleLogin } =
    useProfileData();
  const [isActive, setIsActive] = useState<string | null>("Profile");
  const [isInputActive, setIsInputActive] = useState<string | null>("");
  const { logout } = useAuthStore();

  const handleModalUpload = () => {
    setIsModalUploadOpen(!isModalUploadOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleActiveTab = (tab: string) => {
    setIsActive(tab);
  };

  const handleActiveInput = (input: string) => {
    setIsInputActive(input);
  };

  const ProfileItems = [
    { id: 1, name: "Profile", icon: <UserPen /> },
    {
      id: 2,
      name: "Information",
      icon: <Info />,
    },
    {
      id: 3,
      name: "Address",
      icon: <MapPin />,
    },
    {
      id: 4,
      name: "My Orders",
      icon: <ClipboardList />,
    },
    {
      id: 5,
      name: "Notification",
      icon: <Bell />,
    },
    {
      id: 6,
      name: "Change Password",
      icon: <Lock />,
    },
  ];

  const ProfileTabItems = [
    { id: 1, name: "Downloads", icon: <Download size={45} /> },
    { id: 2, name: "Orders", icon: <PackageOpen size={45} /> },
    { id: 3, name: "Wishlist", icon: <Heart size={45} /> },
    { id: 4, name: "Gift Box", icon: <Gift size={45} /> },
  ];

  const InformationInput: InformationRow[] = [
    {
      id: 1,
      fields: [
        {
          id: "firstName",
          label: "First name",
          type: "text",
          name: "firstName",
          value: formData?.personal.firstName || "",
          icon: <IdCard />,
        },
        {
          id: "lastName",
          type: "text",
          label: "Last name",
          name: "lastName",
          value: formData?.personal.lastName || "",
          icon: <IdCard />,
        },
      ],
    },
    {
      id: 2,
      fields: [
        {
          id: "username",
          label: "username",
          type: "text",
          name: "username",
          value: formData?.personal.username || "",
          icon: <User />,
        },
        {
          id: "phoneNumber",
          label: "Phone number",
          type: "number",
          name: "phoneNumber",
          value: formData?.personal.phoneNumber || "",
          icon: <Phone />,
        },
      ],
    },
    {
      id: 3,
      fields: [
        {
          id: "email",
          label: "Email",
          type: "email",
          name: "email",
          value: formData?.personal.email || "",
          icon: <Mail />,
        },
      ],
    },
  ];

  const tabContent: Record<string, JSX.Element> = {
    Profile: (
      <div className="flex flex-col border border-gray-200 p-5 shadow-2xl ">
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 relative">
          <div className="flex gap-x-3">
            <div className="relative w-20 h-20" onClick={handleModalUpload}>
              <img
                src={`${formData?.personal.profilePicture}`}
                alt="profile picture"
                className="border rounded-full h-20 w-20 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-[#0989ff] p-1 rounded-full shadow cursor-pointer hover:bg-black transition-all duration-300 ease-in-out">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-3xl font-semibold">
              Welcome {formData?.personal.username}!
            </span>
          </div>
          <div className="absolute right-5 top-1/4">
            <button
              className="px-3 py-2 border border-gray-300 hover:bg-[#0989ff] hover:text-white transition-all duration-300 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5">
          {ProfileTabItems.map((pit) => (
            <div className="p-10 border border-gray-200 h-40" key={pit.id}>
              <div className="flex flex-col items-center gap-3">
                <span className="">{pit.icon}</span>
                <span className="font-semibold text-xl">{pit.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    Information: (
      <div className="flex flex-col border border-gray-200 p-7 shadow-2xl">
        <span className="text-2xl font-semibold mb-10">Personal Details</span>
        {InformationInput.map((row) => (
          <div
            key={row.id}
            className={`grid gap-4 mb-4 ${
              row.fields.length === 3
                ? "grid-cols-1 md:grid-cols-3"
                : row.fields.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {row.fields.map((field) => (
              <div
                className={`border p-3 flex items-center gap-x-2 transition-all duration-300 ease-in-out ${
                  isInputActive === field.name
                    ? "border-[#0989ff] "
                    : "border-gray-200"
                }`}
                key={field.id}
                onClick={() => handleActiveInput(String(field.name))}
              >
                {field.icon}
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  className="w-full p-2 focus:outline-none"
                  value={field.value}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Update profile button */}
        <div className="py-5">
          <button className="px-3 py-4 bg-[#010F1C] text-white w-1/5 cursor-pointer hover:bg-white hover:text-black transition-all duration-300 ease-in-out border hover:border-gray-800">
            Update Profile
          </button>
        </div>
      </div>
    ),
    Address: <div>Address</div>,
    "My Orders": <div>My Orders</div>,
    Notification: <div>Notification</div>,
    "Change Password": <div>Change Password</div>,
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white w-full transform transition-all duration-300 shadow-2xl">
        <SubHeader />
      </div>
      <ModalUpload
        isOpen={isModalUploadOpen}
        onClose={() => setIsModalUploadOpen(false)}
      />
      <div className="h-screen container mx-auto flex items-start justify-center py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          <div className="w-96 border border-gray-200 shadow-xl min-h-60 flex flex-col self-start">
            <ul className="text-lg" role="tablist">
              {ProfileItems.map(({ id, name, icon }) => (
                <li
                  key={id}
                  role="tab"
                  aria-selected={isActive === name}
                  onClick={() => handleActiveTab(name)}
                  className={`${
                    isActive === name
                      ? "bg-[#0989ff0f] text-[#0989ff] font-semibold"
                      : ""
                  } p-5 cursor-pointer`}
                >
                  <div className="flex gap-3 items-center">
                    {icon}
                    {name}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 w-full">
            {tabContent[isActive ?? "Profile"]}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
