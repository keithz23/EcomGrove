"use client";
import { Camera, MapPinHouse, Newspaper } from "lucide-react";
import { JSX, useEffect, useState } from "react";
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
import useProfile from "../hooks/useProfile";
import { getErrorMessage } from "../utils/getMessageError.util";
import { authService } from "../services/public/auth.service";
import toast from "react-hot-toast";

type ChangePasswordFormValues = {
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
  const router = useRouter();
  const { profile, refetch } = useProfile();
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
  } = useForm<ChangePasswordFormValues>({ mode: "onBlur" });

  // Form hooks for Information
  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
    reset,
  } = useForm<InformationFormValues>({ mode: "onBlur" });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        username: profile.username || "",
        email: profile.email || "",
        phoneNumber: profile.phone || "",
      });
    }
  }, [profile, reset]);

  const handleModalUpload = () => setIsModalUploadOpen(!isModalUploadOpen);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleActiveTab = (tab: string) => setIsActive(tab);

  const handleActiveInput = (input: string) => setIsInputActive(input);

  const handleChangePasswordSubmit = async (data: ChangePasswordFormValues) => {
    const { newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      toast.error("Confirm password does not match");
      return;
    }

    try {
      const res = await authService.changePassword(data);

      if (res.status === 201) {
        toast.success("Password changed successfully");
        resetPasswordForm();
        logout();
        router.push("/login");
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(msg || "Failed to change password");
    }
  };

  const tabContent: Record<string, JSX.Element> = {
    Profile: (
      <div className="flex flex-col border border-gray-200 p-5 shadow-2xl bg-white">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 p-4">
          <div className="flex gap-x-4 items-center">
            <div className="relative w-20 h-20" onClick={handleModalUpload}>
              <Image
                src={`${
                  profile?.picture ||
                  "https://doodleipsum.com/700/avatar?i=bc3a7b2ecb91d1a6c511a620968c8a06"
                }?v=${Date.now()}`}
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
            <span className="text-2xl font-semibold">
              Welcome, {profile?.username}!
            </span>
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
    Address: (
      <div className="">
        <div className="flex flex-col border border-gray-200 p-7 shadow-2xl bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="">
              <div className="flex items-center gap-x-4">
                <Newspaper size={40} className="text-electric-blue" />
                <h2 className="text-xl font-bold">Billing Address</h2>
              </div>
              <div className="py-3 px-14">
                {profile?.address.map((pat) => (
                  <ul className="flex flex-col gap-y-3" key={pat.id}>
                    <li>
                      <span className="font-semibold">Street:</span>{" "}
                      {pat.street}
                    </li>
                    <li>
                      <span className="font-semibold">City:</span> {pat.city}
                    </li>
                    <li>
                      <span className="font-semibold">Ward:</span> {pat.ward}
                    </li>
                    <li>
                      <span className="font-semibold">Phone:</span>{" "}
                      {profile.phone}
                    </li>
                    <li>
                      <span className="font-semibold">Zip code:</span>{" "}
                      {pat.zipCode}
                    </li>
                    <li>
                      <span className="font-semibold">
                        Country calling code:
                      </span>{" "}
                      {pat.countryCallingCode}
                    </li>
                    <li>
                      <span className="font-semibold">Country:</span>{" "}
                      {pat.country}
                    </li>
                  </ul>
                ))}
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-x-4">
                <MapPinHouse size={40} className="text-electric-blue" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>
              <div className="py-3 px-14">
                {profile?.address.map((pat) => (
                  <ul className="flex flex-col gap-y-3" key={pat.id}>
                    <li>
                      <span className="font-semibold">Street:</span>{" "}
                      {pat.street}
                    </li>
                    <li>
                      <span className="font-semibold">City:</span> {pat.city}
                    </li>
                    <li>
                      <span className="font-semibold">Ward:</span> {pat.ward}
                    </li>
                    <li>
                      <span className="font-semibold">Phone:</span>{" "}
                      {profile.phone}
                    </li>
                    <li>
                      <span className="font-semibold">Zip code:</span>{" "}
                      {pat.zipCode}
                    </li>
                    <li>
                      <span className="font-semibold">
                        Country calling code:
                      </span>{" "}
                      {pat.countryCallingCode}
                    </li>
                    <li>
                      <span className="font-semibold">Country:</span>{" "}
                      {pat.country}
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    "My Orders": <div className="p-5">My Orders</div>,
    Notification: <div className="p-5">Notification</div>,
    "Change Password": (
      <div className="">
        <div className="flex flex-col border border-gray-200 p-7 shadow-2xl bg-white">
          <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit(handleChangePasswordSubmit)}>
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
                        passwordErrors[
                          field.name as keyof ChangePasswordFormValues
                        ]
                          ? "border-red-500"
                          : ""
                      }`}
                      {...register(
                        field.name as keyof ChangePasswordFormValues,
                        field.validations
                      )}
                    />

                    {passwordErrors[
                      field.name as keyof ChangePasswordFormValues
                    ] && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          passwordErrors[
                            field.name as keyof ChangePasswordFormValues
                          ]?.message
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
        onUploadSuccess={refetch}
      />

      <div className="min-h-screen container mx-auto px-4 py-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 shadow-xl sticky top-32 h-fit">
            <ul className="text-base" role="tablist">
              {ProfileItems.filter(
                ({ name }) => !(name === "Change Password" && profile?.googleId)
              ).map(({ id, name, icon }) => (
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
