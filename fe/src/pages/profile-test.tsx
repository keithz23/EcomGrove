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
import { JSX, useState, useEffect } from "react";
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
import { useForm } from "react-hook-form";

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type InformationFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  email: string;
};

export default function ProfileTest() {
  const navigate = useNavigate();
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "changePassword" | "updateUser" | ""
  >("");
  const { formData, updateFormData, handleChange, isGoogleLogin } =
    useProfileData();
  const [isActive, setIsActive] = useState<string>("Profile");
  const [isInputActive, setIsInputActive] = useState<string>("");
  const { logout } = useAuthStore();

  // Form hooks for Change Password
  const {
    register,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<FormValues>({ mode: "onBlur" });

  // Form hooks for Information
  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
    setValue: setInfoValue,
  } = useForm<InformationFormValues>({ mode: "onBlur" });

  useEffect(() => {
    if (formData?.personal) {
      setInfoValue("firstName", formData.personal.firstName || "");
      setInfoValue("lastName", formData.personal.lastName || "");
      setInfoValue("username", formData.personal.username || "");
      setInfoValue("phoneNumber", formData.personal.phoneNumber || "");
      setInfoValue("email", formData.personal.email || "");
    }
  }, [formData, setInfoValue]);

  const handleModalUpload = () => setIsModalUploadOpen(!isModalUploadOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleActiveTab = (tab: string) => setIsActive(tab);

  const handleActiveInput = (input: string) => setIsInputActive(input);

  const handleChangePassword = async (otpValue: string, data: FormValues) => {
    const payload: IChangePassword = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    const headers = {
      "Content-Type": "application/json",
      otp: otpValue,
    };

    return await authService.changePassword(payload, headers);
  };

  const handleUpdateUser = async (
    otpValue: string,
    data: InformationFormValues
  ) => {
    try {
      const response = await userService.updateUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          phoneNumber: data.phoneNumber,
          email: data.email,
        },
        { otp: otpValue }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleModalConfirm = async (
    otpValue: string,
    formData?: FormValues | InformationFormValues
  ) => {
    try {
      let response;

      if (
        actionType === "changePassword" &&
        formData &&
        "oldPassword" in formData
      ) {
        response = await handleChangePassword(otpValue, formData);
        resetPasswordForm();
        await logout();
      } else if (
        actionType === "updateUser" &&
        formData &&
        "firstName" in formData
      ) {
        response = await handleUpdateUser(otpValue, formData);
        // updateFormData(formData);
      }

      if (response?.status === 200) {
        toast.success(response.data.message || "Success!");
        if (actionType === "updateUser") window.location.reload();
      } else {
        toast.error(response?.data?.message || "Something went wrong.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
      console.error("Error:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateInformation = async (data: InformationFormValues) => {
    setActionType("updateUser");
    try {
      const response = await userService.sendOtpCode();
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsModalOpen(true);
        // Pass form data to modal confirm
        return { data, actionType: "updateUser" };
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      console.error(
        `Error while sending otp: ${error.response?.data?.message}`
      );
      setIsModalOpen(false);
    }
  };

  const handleChangePasswordSubmit = async (data: FormValues) => {
    setActionType("changePassword");
    try {
      const response = await userService.sendOtpCode();
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsModalOpen(true);
        // Pass form data to modal confirm
        return { data, actionType: "changePassword" };
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      console.error(
        `Error while sending otp: ${error.response?.data?.message}`
      );
      setIsModalOpen(false);
    }
  };

  const ProfileItems = [
    { id: 1, name: "Profile", icon: <UserPen /> },
    { id: 2, name: "Information", icon: <Info /> },
    { id: 3, name: "Address", icon: <MapPin /> },
    { id: 4, name: "My Orders", icon: <ClipboardList /> },
    { id: 5, name: "Notification", icon: <Bell /> },
    ...(isGoogleLogin
      ? []
      : [{ id: 6, name: "Change Password", icon: <Lock /> }]),
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
          type: "tel",
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
          validations: {
            required: "Old password is required",
            minLength: {
              value: 8,
              message: "Old password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
              message:
                "Password must contain at least one uppercase letter and one special character",
            },
          },
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
          validations: {
            required: "New password is required",
            minLength: {
              value: 8,
              message: "New password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
              message:
                "Password must contain at least one uppercase letter and one special character",
            },
          },
        },
        {
          id: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          name: "confirmPassword",
          validations: {
            required: "Confirm password is required",
            minLength: {
              value: 8,
              message: "Confirm password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
              message:
                "Password must contain at least one uppercase letter and one special character",
            },
          },
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
                src={
                  formData?.personal.profilePicture ||
                  "https://via.placeholder.com/80"
                }
                alt="Profile picture"
                className="border rounded-full h-20 w-20 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/80";
                }}
              />
              <div className="absolute bottom-0 right-0 bg-[#0989ff] p-1 rounded-full shadow cursor-pointer hover:bg-black transition-all duration-300 ease-in-out">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-2xl font-semibold">
              Welcome {formData?.personal.username || "User"}!
            </span>
          </div>
          <button
            className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-[#0989ff] hover:text-white transition"
            onClick={handleLogout}
            aria-label="Logout"
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
        <h2 className="text-2xl font-semibold mb-6">Personal Details</h2>
        <form
          onSubmit={handleInfoSubmit(async (data) => {
            const result = await handleUpdateInformation(data);
            if (result) {
              // Store form data for OTP confirmation
              (window as any).__formData = result.data;
            }
          })}
        >
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
                  className={`border p-3 flex items-center gap-2 transition ${
                    isInputActive === field.name
                      ? "border-[#0989ff]"
                      : "border-gray-200"
                  }`}
                  key={field.id}
                  onClick={() => handleActiveInput(field.name || "")}
                >
                  {field.icon}
                  <input
                    id={field.id}
                    {...registerInfo(
                      field.name as keyof InformationFormValues,
                      {
                        required: `${field.label} is required`,
                      }
                    )}
                    type={field.type}
                    className="w-full p-2 focus:outline-none bg-transparent"
                    aria-label={field.label}
                  />
                  {infoErrors[field.name as keyof InformationFormValues] && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        infoErrors[field.name as keyof InformationFormValues]
                          ?.message
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="pt-4">
            <button
              type="submit"
              className="px-4 py-3 bg-[#010F1C] text-white hover:bg-white hover:text-black border border-gray-800 transition w-full sm:w-auto cursor-pointer"
              aria-label="Update Profile"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    ),
    Address: <div className="p-5">Address</div>,
    "My Orders": <div className="p-5">My Orders</div>,
    Notification: <div className="p-5">Notification</div>,
    "Change Password": (
      <div className="p-5">
        <div className="flex flex-col border border-gray-200 p-7 shadow-2xl bg-white">
          <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
          <form
            onSubmit={handlePasswordSubmit(async (data) => {
              const result = await handleChangePasswordSubmit(data);
              if (result) {
                // Store form data for OTP confirmation
                (window as any).__formData = result.data;
              }
            })}
          >
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
                  <div
                    className="relative z-0 w-full mb-6 group"
                    key={field.id}
                  >
                    <input
                      id={field.id}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none 
                        focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      {...register(
                        field.name as keyof FormValues,
                        field.validations
                      )}
                      type={field.type}
                      placeholder=" "
                      aria-label={field.label}
                    />
                    <label
                      htmlFor={field.id}
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      {field.label}
                    </label>
                    {passwordErrors[field.name as keyof FormValues] && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          passwordErrors[field.name as keyof FormValues]
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-3 bg-[#010F1C] text-white hover:bg-white hover:text-black border border-gray-800 transition w-full sm:w-auto cursor-pointer"
                aria-label="Update Password"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    ),
  } as Record<string, JSX.Element>;

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
        onConfirm={(otpValue) =>
          handleModalConfirm(otpValue, (window as any).__formData)
        }
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

          <div className="md:col-span-2">{tabContent[isActive]}</div>
        </div>
      </div>

      <Footer />
    </>
  );
}
