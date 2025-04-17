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
import {
  ChangePasswordRow,
  IChangePassword,
  InformationRow,
} from "../interfaces";
import { authService, userService } from "../services";
import Modal from "../components/common/Modal";
import toast from "react-hot-toast";

export default function ProfileTest() {
  const navigate = useNavigate();
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formData, updateFormData, handleChange, isGoogleLogin } =
    useProfileData();
  const [isActive, setIsActive] = useState<string | null>("Profile");
  const [isInputActive, setIsInputActive] = useState<string | null>("");
  const { logout } = useAuthStore();
  const [password, setPassword] = useState<IChangePassword>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleModalUpload = () => setIsModalUploadOpen(!isModalUploadOpen);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleActiveTab = (tab: string) => setIsActive(tab);
  const handleActiveInput = (input: string) => setIsInputActive(input);
  const [actionType, setActionType] = useState("");
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (otpValue: string) => {
    const payload: IChangePassword = {
      oldPassword: password.oldPassword,
      newPassword: password.newPassword,
      confirmPassword: password.confirmPassword,
    };

    const headers = {
      "Content-Type": "application/json",
      otp: otpValue,
    };

    const response = await authService.changePassword(payload, headers);

    return response;
  };

  const handleModalConfirm = async (otpValue: string) => {
    try {
      let response;

      if (actionType === "changePassword") {
        response = await handleChangePassword(otpValue);
        setPassword({
          oldPassword: "",
          confirmPassword: "",
          newPassword: "",
        });

        await logout();
      }

      if (response?.status === 200) {
        toast.success(response.data.message || "Success!");
        if (actionType === "updateUser") window.location.reload();
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error("Something went wrong.");
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateInformation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    try {
      const response = await userService.sendOtpCode();
      if (response.status === 200) {
        toast.success(response.data.message);
        console.log(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(`Error while sending otp: ${error.response.data.message}`);
    }
  };

  const ProfileItems = [
    { id: 1, name: "Profile", icon: <UserPen /> },
    { id: 2, name: "Information", icon: <Info /> },
    { id: 3, name: "Address", icon: <MapPin /> },
    { id: 4, name: "My Orders", icon: <ClipboardList /> },
    { id: 5, name: "Notification", icon: <Bell /> },
    { id: 6, name: "Change Password", icon: <Lock /> },
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
          label: "Username",
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

  const ChangePasswordInput: ChangePasswordRow[] = [
    {
      id: 1,
      fields: [
        {
          id: "oldPassword",
          label: "Old Password",
          type: "password",
          name: "oldPassword",
          value: password.oldPassword,
        },
      ],
    },
    {
      id: 2,
      fields: [
        {
          id: "newPassword",
          label: "New Password",
          type: "password",
          name: "newPassword",
          value: password.newPassword,
        },
        {
          id: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          name: "confirmPassword",
          value: password.confirmPassword,
        },
      ],
    },
  ];

  const tabContent: Record<string, JSX.Element> = {
    Profile: (
      <div className="flex flex-col border border-gray-200 p-5 shadow-2xl bg-white">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 p-4">
          <div className="flex gap-x-4 items-center">
            <div className="relative w-20 h-20" onClick={handleModalUpload}>
              <img
                src={`${formData?.personal.profilePicture}`}
                alt="profile"
                className="border rounded-full h-20 w-20 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-[#0989ff] p-1 rounded-full shadow cursor-pointer hover:bg-black transition-all duration-300 ease-in-out">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-2xl font-semibold">
              Welcome {formData?.personal.username}!
            </span>
          </div>
          <button
            className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-[#0989ff] hover:text-white transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {ProfileTabItems.map((pit) => (
            <div
              className="p-6 border border-gray-200 flex flex-col items-center gap-3 hover:shadow"
              key={pit.id}
            >
              <span>{pit.icon}</span>
              <span className="font-semibold text-lg">{pit.name}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    Information: (
      <div className="flex flex-col border border-gray-200 p-7 shadow-2xl bg-white">
        <span className="text-2xl font-semibold mb-6">Personal Details</span>
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
                className={`border p-3 flex items-center gap-2 rounded transition ${
                  isInputActive === field.name
                    ? "border-[#0989ff]"
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
                  className="w-full p-2 focus:outline-none bg-transparent"
                  value={field.value}
                />
              </div>
            ))}
          </div>
        ))}

        <div className="pt-4">
          <button className="px-4 py-3 bg-[#010F1C] text-white hover:bg-white hover:text-black border border-gray-800 transition w-full sm:w-auto cursor-pointer">
            Update Profile
          </button>
        </div>
      </div>
    ),
    Address: <div className="p-5">Address</div>,
    "My Orders": <div className="p-5">My Orders</div>,
    Notification: <div className="p-5">Notification</div>,
    "Change Password": (
      <div className="p-5">
        <div className="flex flex-col border border-gray-200 p-7 shadow-2xl bg-white">
          <form onSubmit={handleUpdateInformation}>
            {ChangePasswordInput.map((row) => (
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
                  <div className="relative z-0 w-full mb-6 group" key={field.id}>
                    <input
                      id={field.id}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none 
                focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      name={field.name}
                      type={field.type}
                      value={field.value}
                      onChange={handlePasswordChange}
                      placeholder=""
                    />
                    <label
                      htmlFor={field.name}
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-3 bg-[#010F1C] text-white hover:bg-white hover:text-black border border-gray-800 transition w-full sm:w-auto cursor-pointer"
                onClick={() => setActionType("changePassword")}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white w-full shadow-md">
        <SubHeader />
      </div>

      <Modal
        isOpen={isModalOpen}
        name="Confirm Your Identity"
        status="warning"
        input={true}
        confirmButton={true}
        cancelButton={true}
        placeHolder="Your OTP code"
        description="Please enter the verification code to confirm your profile changes."
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      <ModalUpload
        isOpen={isModalUploadOpen}
        onClose={() => setIsModalUploadOpen(false)}
      />

      <div className="min-h-screen container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 shadow-xl">
            <ul className="text-base" role="tablist">
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
                  } p-4 cursor-pointer hover:bg-gray-100 transition`}
                >
                  <div className="flex gap-3 items-center">
                    {icon}
                    {name}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            {tabContent[isActive ?? "Profile"]}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
