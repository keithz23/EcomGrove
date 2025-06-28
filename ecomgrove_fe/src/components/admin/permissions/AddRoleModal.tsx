"use client";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { ICreateRole } from "@/app/features/roles/types/role.interface";

type Props = {
  onClose: () => void;
  onSubmit: (data: ICreateRole) => void;
  isSubmitting: boolean;
};

export const AddRoleModal = ({ onClose, onSubmit, isSubmitting }: Props) => {
  const { register, handleSubmit } = useForm<ICreateRole>();

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Add New Role</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
