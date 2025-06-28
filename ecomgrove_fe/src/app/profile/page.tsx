"use client";
import { Camera } from "lucide-react";
import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/auth/useAuthStore";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/Header/SubHeader";
import { ModalUpload } from "@/components/common/ModalUpload";
import Footer from "@/components/Footer/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChangePasswordInput,
  InformationInput,
  ProfileItems,
  ProfileTabItems,
} from "../constants/ProfileData";
import {
  ChangePasswordFields,
  InformationFields,
} from "../types/profile/profile.interface";
import Image from "next/image";

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

export default function Profile() {
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);
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

  const handleModalUpload = () => setIsModalUploadOpen(!isModalUploadOpen);

  const handleLogout = () => {
    logout();
    useRouter().push("/login");
  };

  const handleActiveTab = (tab: string) => setIsActive(tab);

  const handleActiveInput = (input: string) => setIsInputActive(input);

  const handleChangePasswordSubmit = async (data: FormValues) => {};

  const tabContent: Record<string, JSX.Element> = {
    Profile: (
      <div className="flex flex-col border border-gray-200 p-5 shadow-2xl bg-white">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 p-4">
          <div className="flex gap-x-4 items-center">
            <div className="relative w-20 h-20" onClick={handleModalUpload}>
              <Image
                src={`https://vn4u.vn/wp-content/uploads/2023/09/logo-co-tinh-nhat-quan-2.png`}
                alt="Profile picture"
                referrerPolicy="no-referrer"
                width={80}
                height={80}
                className="border rounded-full h-20 w-20 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-electric-blue p-1 rounded-full shadow cursor-pointer hover:bg-black transition-all duration-300 ease-in-out">
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="text-2xl font-semibold">Welcome!</span>
          </div>
          <button
            className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-electric-blue hover:text-white transition"
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {ProfileTabItems.map((pit) => (
            <div
              className="p-6 border border-gray-200 flex flex-col items-center gap-3 hover:shadow-lg transition-all duration-300"
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
        <form onSubmit={handleInfoSubmit(async (data) => {})}>
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
              {row.fields.map((field: InformationFields) => (
                <div
                  className={`border p-3 flex items-center gap-2 transition ${
                    isInputActive === field.name
                      ? "border-electric-blue"
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
            <Button type="submit" className="p-6" variant={"black"}>
              Update Profile
            </Button>
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
                {row.fields.map((field: ChangePasswordFields) => (
                  <div
                    className="relative z-0 w-full mb-6 group"
                    key={field.id}
                  >
                    <Input
                      id={field.id}
                      type={field.type}
                      label={field.label}
                      className={`${
                        passwordErrors[field.name as keyof FormValues]
                          ? "border-red-500"
                          : ""
                      }`}
                      {...register(
                        field.name as keyof FormValues,
                        field.validations
                      )}
                    />

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
              <Button
                type="submit"
                variant={"black"}
                className="p-6"
                size={"lg"}
              >
                Update
              </Button>
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
                      ? "bg-electric-blue-soft text-electric-blue font-semibold"
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
