"use client";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useReducer, useState } from "react";
import {
  initialModalState,
  userModalReducer,
} from "@/app/features/users/reducers/userModal.reducer";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import useDisableScroll from "@/app/hooks/useDisableScroll";
import { AddCategoryModal } from "./AddCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import useCategory from "@/app/features/categories/hooks/useCategory";
import { categoryService } from "@/app/services/admin/category.service";
import { ICreateCategory } from "@/app/features/categories/types/create-category.interface";
import { useCategoryDetail } from "@/app/features/categories/hooks/useCategoryDetail";
import { IUpdateCategory } from "@/app/features/categories/types/update-category.interface";

export const CategoriesContent: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [modalState, dispatch] = useReducer(
    userModalReducer,
    initialModalState
  );

  useDisableScroll(
    modalState.showAdd || modalState.showEdit || modalState.showDelete
  );

  const { categories, totalPages, loading, error, refetch } = useCategory(
    page,
    limit,
    "false"
  );
  const { category, fetchCategory } = useCategoryDetail();

  const handleAddCategory = async (data: ICreateCategory) => {
    setIsSubmitting(true);
    try {
      await toast.promise(categoryService.createCategory(data), {
        loading: "Creating category...",
        success: "Category created successfully",
        error: (err) => getErrorMessage(err),
      });

      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: IUpdateCategory) => {
    setIsSubmitting(true);
    try {
      await toast.promise(categoryService.updateCategory(data), {
        loading: "Updating category...",
        success: "Category updated successfully",
        error: (err) => getErrorMessage(err),
      });
      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!category) return;
    setIsSubmitting(true);
    try {
      await toast.promise(categoryService.deleteCategory(category.id), {
        loading: "Deleting category...",
        success: "Category deleted successfully",
        error: (err) => getErrorMessage(err),
      });
      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowAddModal = () => {
    dispatch({ type: "SHOW_ADD" });
  };

  const handleShowDeleteModal = async (id: string) => {
    try {
      await fetchCategory(id);
      dispatch({ type: "SHOW_DELETE" });
    } catch (error) {
      toast.error("Failed to load category data");
    }
  };

  const handleShowEditModal = async (id: string) => {
    try {
      await fetchCategory(id);
      dispatch({ type: "SHOW_EDIT" });
    } catch (error) {
      toast.error("Failed to load cagory data");
    }
  };

  const categoriesData = categories.map((data) => ({
    id: data.id,
    name: data.name,
    description: data.description,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            Categories
          </h2>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>

            <button
              onClick={handleShowAddModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap"
            >
              <Plus />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-6 text-center text-gray-500">
          Loading categories...
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer"
                      onClick={() => handleShowEditModal(category.id)}
                    >
                      <SquarePen />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      onClick={() => handleShowDeleteModal(category.id)}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-sm rounded border ${
                page === i + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {modalState.showAdd && (
        <AddCategoryModal
          isSubmitting={isSubmitting}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleAddCategory}
        />
      )}
      {modalState.showEdit && category && (
        <EditCategoryModal
          isSubmitting={isSubmitting}
          categoriesData={category}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleUpdateUser}
        />
      )}
      {modalState.showDelete && category && (
        <DeleteCategoryModal
          onSubmit={handleDeleteUser}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          categoriesData={category}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
