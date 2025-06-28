import { useState, useEffect } from "react";
import usePermissionGroup from "@/app/features/permissions/hooks/usePermissionGroup";
import useRole from "@/app/features/roles/hooks/useRole";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";
import { useRoleDetail } from "@/app/features/roles/hooks/useRoleDetail";
import { permissionsService } from "@/app/services/admin/permissions.service";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/app/utils/getMessageError.util";

export default function PermissionsTabView() {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [permissionsId, setPermissionsId] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, Set<string>>
  >({});

  const { roles: rolesData } = useRole(page, limit, "true");
  const { role, fetchRole } = useRoleDetail();
  const { permissionGroup: permissionGroups, refetch } = usePermissionGroup(
    page,
    limit,
    "true"
  );

  useEffect(() => {
    if (activeRoleId && role?.rolePermissions) {
      const existing = role.rolePermissions.map((rp) => rp.permissionId);
      setSelectedPermissions((prev) => ({
        ...prev,
        [activeRoleId]: new Set(existing),
      }));
      setPermissionsId(existing);
    }
  }, [role, activeRoleId]);

  const togglePermission = (roleId: string, permissionId: string) => {
    setSelectedPermissions((prev) => {
      const current = new Set(prev[roleId] || []);

      if (current.has(permissionId)) {
        current.delete(permissionId);
      } else {
        current.add(permissionId);
      }

      const updated = Array.from(current);
      setPermissionsId(updated);

      return { ...prev, [roleId]: current };
    });
  };

  const handleAssignPermissions = async () => {
    try {
      const resData = await permissionsService.assignPermissions(
        String(activeRoleId),
        permissionsId
      );

      if (resData.status == 201 && resData.data) {
        toast.success(resData.data.message);
        refetch();
      }
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const toggleGroupPermissions = (
    permissions: { id: string }[],
    checkAll: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const currentSet = new Set(prev[activeRoleId!] || []);
      const updatedSet = new Set(currentSet);

      if (checkAll) {
        permissions.forEach((p) => updatedSet.add(String(p.id)));
      } else {
        permissions.forEach((p) => updatedSet.delete(String(p.id)));
      }

      setPermissionsId(Array.from(updatedSet));

      return { ...prev, [activeRoleId!]: updatedSet };
    });
  };

  const handleTabClick = async (roleId: string) => {
    setActiveRoleId(roleId);
    await fetchRole(roleId);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {rolesData.map((role) => (
          <button
            key={role.id}
            onClick={() => handleTabClick(String(role.id))}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-150 cursor-pointer
              ${
                activeRoleId === role.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {capitalizeFirstLetter(role.name)}
          </button>
        ))}
      </div>

      {/* Permissions Panel */}
      {activeRoleId && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          {permissionGroups.map((group) => {
            const groupPermissionIds = group.permissions.map((p) =>
              String(p.id)
            );
            const selectedInGroup = groupPermissionIds.filter((id) =>
              selectedPermissions[activeRoleId!]?.has(id)
            );

            const allSelected =
              selectedInGroup.length === group.permissions.length;
            const partiallySelected =
              selectedInGroup.length > 0 && !allSelected;

            return (
              <div
                key={group.id}
                className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                {/* Header with master checkbox */}
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = partiallySelected;
                      }}
                      onChange={(e) =>
                        toggleGroupPermissions(
                          group.permissions
                            .filter((p) => typeof p.id === "string")
                            .map((p) => ({ id: String(p.id) })),
                          e.target.checked
                        )
                      }
                      className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-base font-semibold text-gray-700">
                      {capitalizeFirstLetter(group.name)}
                    </span>
                  </label>
                </div>

                {/* Permission checkboxes */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.permissions.map((permission) => {
                    const isChecked =
                      selectedPermissions[activeRoleId!]?.has(
                        String(permission.id)
                      ) ??
                      role?.rolePermissions?.some(
                        (rp) =>
                          rp.permissionId === permission.id &&
                          rp.roleId === activeRoleId
                      ) ??
                      false;

                    return (
                      <label
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            togglePermission(
                              activeRoleId!,
                              String(permission.id)
                            )
                          }
                          className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-800">
                          {permission.displayName}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">
              Reset
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={handleAssignPermissions}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
