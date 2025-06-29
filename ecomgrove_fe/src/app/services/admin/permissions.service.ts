import { EService } from "@/app/enums/EService";
import { EAdminService } from "@/app/enums/services/admin/EAdminService";
import { EPermissionGroup } from "@/app/enums/services/admin/EPermissionGroup";
import { EPermissions } from "@/app/enums/services/admin/EPermissionService";
import { instance } from "@/lib/axios";

export const permissionsService = {
  assignPermissions: (roleId: string, permissionsId: string[]) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.PERMISSIONS}/${EPermissions.ASSIGN_PERMISSIONS}`;
    return instance.post(url, { roleId, permissionsId });
  },

  findAllPermissions: (page: number, limit: number, all: string) => {
    const query = all === "true" ? "all=true" : `page=${page}&limit=${limit}`;
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.PERMISSIONS}/${EPermissions.FIND_ALL_PERMISSIONS}?${query}`;
    return instance.get(url);
  },

  findAllPermissionGroup: (page: number, limit: number, all: string) => {
    const query = all === "true" ? "all=true" : `page=${page}&limit=${limit}`;
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.PERMISSIONs_GROUP}/${EPermissionGroup.FIND_ALL_PERMISSION_GROUP}?${query}`;
    return instance.get(url);
  },
};
