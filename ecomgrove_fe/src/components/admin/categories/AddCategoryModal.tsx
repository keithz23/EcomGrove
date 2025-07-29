"use client";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { ICreateCategory } from "@/app/features/categories/types/create-category.interface";

type Props = {
  onClose: () => void;
  onSubmit: (data: ICreateCategory) => void;
  isSubmitting: boolean;
};

export const AddCategoryModal = ({
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateCategory>({
    mode: "onBlur",
  });

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-screen">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Add New Category
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            <X />
          </button>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  {...register("name", {
                    required: "First name is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.name ? "border-red-400 ring-red-200" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  {...register("description", {
                    required: "Last name is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.description ? "border-red-400 ring-red-200" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
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
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
