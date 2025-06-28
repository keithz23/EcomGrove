import useRole from "@/app/features/roles/hooks/useRole";
import { IUpdateUser } from "@/app/types/admin/update-user.interface";
import { UsersInterface } from "@/app/types/admin/users.interface";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";
import { CloudUpload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  onClose: () => void;
  onSubmit: (data: IUpdateUser, picture?: File | null) => void;
  userData: UsersInterface;
  isSubmitting: boolean;
};

export const EditUserModal = ({
  userData,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUpdateUser>({ mode: "onBlur" });

  const { roles: rolesData } = useRole(1, 10, "true");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedFile(file);
  };

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        phone: userData.phone,
        email: userData.email,
        role: userData.userRoles?.[0]?.role?.name ?? "",
        status: userData.isActive ? "true" : "false",
        password: userData.password || "",
      });
    }
  }, [userData, rolesData, reset]);

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 flex flex-col max-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <div
          className="overflow-y-auto px-6"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <form
            onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}
            className="py-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.firstName ? "border-red-400 ring-red-200" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.lastName ? "border-red-400 ring-red-200" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    minLength: {
                      value: 8,
                      message: "Phone number must be at least 8 digits",
                    },
                    pattern: {
                      value: /^[0-9+() -]*$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.phone ? "border-red-400 ring-red-200" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.username ? "border-red-400 ring-red-200" : ""
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.email ? "border-red-400 ring-red-200" : ""
                  }`}
                  disabled
                  readOnly
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  {...register("role", { required: "Please select a role" })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.role ? "border-red-400 ring-red-200" : ""
                  }`}
                >
                  <option value="">Select Role</option>
                  {rolesData.map((role: any) => (
                    <option value={role.name} key={role.id}>
                      {capitalizeFirstLetter(role.name)}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register("status", { required: "Please select status" })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.status ? "border-red-400 ring-red-200" : ""
                  }`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Current Profile Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Profile Image
                </label>
                <img
                  src={userData.picture}
                  alt={userData.firstName + " " + userData.lastName}
                  className="w-20 h-20 rounded-full object-cover object-top"
                />
              </div>

              {/* Upload Profile Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Profile Image
                </label>

                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg h-[10rem] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors duration-200"
                        onClick={() => {
                          setPreviewImage(null);
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                      <CloudUpload className="text-gray-400 mb-3" size={50} />
                      <div className="flex text-sm text-gray-600">
                        <span className="relative bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 px-2">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            {/* Form footer */}
            <div className="pt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
