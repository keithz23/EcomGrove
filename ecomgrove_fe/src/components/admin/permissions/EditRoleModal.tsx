import { IRoles, IUpdateRole } from "@/app/features/roles/types/role.interface";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onClose: () => void;
  onSubmit: (data: IUpdateRole) => void;
  role: IRoles;
  isSubmitting: boolean;
};

export const EditRoleModal = ({
  role,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const { register, handleSubmit, reset } = useForm<IUpdateRole>();

  useEffect(() => {
    if (role) {
      reset({
        id: role.id,
        name: role.name,
        description: role.description,
      });
    }
  }, [role, reset]);

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Edit Role</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Description
              </label>
              <input
                {...register("description")}
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
