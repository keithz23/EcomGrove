import { ICategories } from "@/app/features/categories/types/category.interface";
import { IUpdateCategory } from "@/app/features/categories/types/update-category.interface";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onClose: () => void;
  onSubmit: (data: IUpdateCategory) => void;
  categoriesData: ICategories;
  isSubmitting: boolean;
};

export const EditCategoryModal = ({
  categoriesData,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUpdateCategory>({ mode: "onBlur" });

  useEffect(() => {
    if (categoriesData) {
      reset({
        id: categoriesData.id,
        name: categoriesData.name,
        description: categoriesData.description,
      });
    }
  }, [categoriesData, reset]);

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 flex flex-col max-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Edit Category</h3>
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
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="py-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  {...register("name", {
                    required: "Category name is required",
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
                    required: "Description is required",
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
