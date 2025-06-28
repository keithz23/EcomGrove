"use client";
import { filterOptions } from "@/app/constants/UserContentData";
import { usersService } from "@/app/services/admin";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useReducer, useState } from "react";
import { AddUserModal } from "./AddUserModal";
import {
  initialModalState,
  userModalReducer,
} from "@/app/features/users/reducers/userModal.reducer";
import { ICreateUser } from "@/app/types/admin/create-user.interface";
import toast from "react-hot-toast";
import { EditUserModal } from "./EditUserModal";
import { IUpdateUser } from "@/app/types/admin/update-user.interface";
import { useUsers } from "@/app/features/users/hooks/useUser";
import { useUserDetail } from "@/app/features/users/hooks/useUserDetail";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { DeleteUserModal } from "./DeleteUserModal";

export const UsersContent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [modalState, dispatch] = useReducer(
    userModalReducer,
    initialModalState
  );

  const {
    users: userData,
    totalPages,
    loading,
    error,
    refetch,
  } = useUsers(page, limit);
  const { user, fetchUser, loading: userLoading } = useUserDetail();

  const handleAddUser = async (data: ICreateUser, picture?: File | null) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }
      if (picture) {
        formData.append("picture", picture);
      }

      await toast.promise(usersService.createUser(formData), {
        loading: "Creating user...",
        success: "User created successfully",
        error: (err) => getErrorMessage(err),
      });

      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: IUpdateUser, picture?: File | null) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, (data as any)[key]);
      }
      if (picture) {
        formData.append("picture", picture);
      }
      await toast.promise(usersService.updateUser(formData), {
        loading: "Updating user...",
        success: "User updated successfully",
        error: (err) => getErrorMessage(err),
      });
      refetch();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await toast.promise(usersService.deleteUser(user.id), {
        loading: "Deleting user...",
        success: "User deleted successfully",
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
      await fetchUser(id);
      dispatch({ type: "SHOW_DELETE" });
    } catch (error) {
      toast.error("Failed to load user info");
    }
  };

  const handleShowEditModal = async (id: string) => {
    try {
      await fetchUser(id);
      dispatch({ type: "SHOW_EDIT" });
    } catch (error) {
      toast.error("Failed to load user info");
    }
  };

  const users = userData.map((data) => ({
    id: data.id,
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    role: data.userRoles?.[0]?.role?.name || "N/A",
    status: data.isActive ? "Active" : "Inactive",
    date: new Date(data.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    avatar:
      data.picture ||
      `https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20person&width=40&height=40`,
  }));

  const filteredUsers = users.filter((user) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && user.status === "Active") ||
      (selectedFilter === "inactive" && user.status === "Inactive");
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            Users
          </h2>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            </div>
            <div className="flex space-x-2">
              {filterOptions.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedFilter(value)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap ${
                    selectedFilter === value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={handleShowAddModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap"
            >
              <Plus />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover object-top"
                        src={user.avatar}
                        alt={user.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer"
                      onClick={() => handleShowEditModal(user.id)}
                    >
                      <SquarePen />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      onClick={() => handleShowDeleteModal(user.id)}
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
        <AddUserModal
          isSubmitting={isSubmitting}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleAddUser}
        />
      )}
      {modalState.showEdit && user && (
        <EditUserModal
          isSubmitting={isSubmitting}
          userData={user}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleUpdateUser}
        />
      )}
      {modalState.showDelete && user && (
        <DeleteUserModal
          onSubmit={handleDeleteUser}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          userData={user}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
