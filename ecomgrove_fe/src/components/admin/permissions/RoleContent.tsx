"use client";
import { rolesService } from "@/app/services/admin";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useReducer, useState } from "react";
import {
  initialModalState,
  userModalReducer,
} from "@/app/features/users/reducers/userModal.reducer";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import useRole from "@/app/features/roles/hooks/useRole";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";
import { AddRoleModal } from "./AddRoleModal";
import {
  ICreateRole,
  IUpdateRole,
} from "@/app/features/roles/types/role.interface";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { useRoleDetail } from "@/app/features/roles/hooks/useRoleDetail";
import { EditRoleModal } from "./EditRoleModal";
import PermissionsContent from "./PermissionsContent";
import useDisableScroll from "@/app/hooks/useDisableScroll";

export const RoleContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [modalState, dispatch] = useReducer(
    userModalReducer,
    initialModalState
  );
  useDisableScroll(
    modalState.showAdd || modalState.showEdit || modalState.showDelete
  );
  const {
    roles: rolesData,
    totalPages: rolesTotalPages,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useRole(page, limit, "false");

  const { role, fetchRole, loading: roleLoading } = useRoleDetail();

  const handleAddRole = async (data: ICreateRole) => {
    setIsSubmitting(true);
    try {
      await toast.promise(rolesService.createRole(data), {
        loading: "Creating user...",
        success: "Role created successfully",
        error: (err) => getErrorMessage(err),
      });
      refetchRoles();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (data: IUpdateRole) => {
    setIsSubmitting(true);
    try {
      await toast.promise(rolesService.updateRole(data), {
        loading: "Updating role...",
        success: "Role updated successfully",
        error: (err) => getErrorMessage(err),
      });
      refetchRoles();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!role) return;
    setIsSubmitting(true);
    try {
      await toast.promise(rolesService.deleteRole(String(role.id)), {
        loading: "Deleting role...",
        success: "Role deleted successfully",
        error: (err) => getErrorMessage(err),
      });
      refetchRoles();
      dispatch({ type: "CLOSE_ALL" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowAddModal = () => {
    dispatch({ type: "SHOW_ADD" });
  };

  const handleShowEditModal = async (id: string) => {
    try {
      await fetchRole(id);
      dispatch({ type: "SHOW_EDIT" });
    } catch (error) {
      toast.error("Failed to load user info");
    }
  };

  const handleShowDeleteModal = async (id: string) => {
    try {
      await fetchRole(id);
      dispatch({ type: "SHOW_DELETE" });
    } catch (error) {
      toast.error("Failed to load role info");
    }
  };

  const roles = rolesData.map((role) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    date: new Date(role.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      {/* Tabs */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Role & Permissions
          </h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button
              className={`px-3 py-2 sm:px-4 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === "roles"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("roles")}
            >
              Roles
            </button>
            <button
              className={`px-3 py-2 sm:px-4 text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === "permissions"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("permissions")}
            >
              Permissions
            </button>
            <button
              onClick={handleShowAddModal}
              className="bg-indigo-600 text-white px-3 py-2 sm:px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "roles" ? (
        <>
          {/* Table */}
          {rolesLoading ? (
            <div className="p-6 text-center text-gray-500">
              Loading Roles...
            </div>
          ) : rolesError ? (
            <div className="p-6 text-center text-red-500">{rolesError}</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[650px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Role
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                        Description
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Created At
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roles.map((role) => (
                      <tr key={role.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 break-words">
                              {capitalizeFirstLetter(role.name)}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="text-sm text-gray-900 break-words max-w-[200px] sm:max-w-none">
                            {role.description}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">
                          <div className="break-words">{role.date}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1"
                              onClick={() =>
                                handleShowEditModal(String(role.id))
                              }
                              title="Edit role"
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 cursor-pointer p-1"
                              onClick={() =>
                                handleShowDeleteModal(String(role.id))
                              }
                              title="Delete role"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 px-4 sm:px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-700 text-center sm:text-left">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{rolesTotalPages}</span>
            </p>
            <div className="flex justify-center sm:justify-end">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-2 sm:px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                {/* Page numbers - responsive display */}
                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(rolesTotalPages, 5) },
                    (_, i) => {
                      let pageNum;
                      if (rolesTotalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= rolesTotalPages - 2) {
                        pageNum = rolesTotalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-2 sm:px-3 py-1 text-sm rounded border ${
                            page === pageNum
                              ? "bg-indigo-500 text-white border-indigo-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, rolesTotalPages))
                  }
                  disabled={page === rolesTotalPages}
                  className="px-2 sm:px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Permissions tab
        <PermissionsContent />
        // <PermissionsMatrix />
      )}

      {/* Modals */}
      {modalState.showAdd && (
        <AddRoleModal
          isSubmitting={isSubmitting}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleAddRole}
        />
      )}
      {modalState.showEdit && role && (
        <EditRoleModal
          role={role}
          isSubmitting={isSubmitting}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleUpdateRole}
        />
      )}
      {modalState.showDelete && role && (
        <DeleteRoleModal
          role={role}
          isSubmitting={isSubmitting}
          onClose={() => dispatch({ type: "CLOSE_ALL" })}
          onSubmit={handleDeleteRole}
        />
      )}
    </div>
  );
};
