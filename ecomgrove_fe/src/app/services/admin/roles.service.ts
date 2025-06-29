import { EService } from "@/app/enums/EService";
import { EAdminService } from "@/app/enums/services/admin/EAdminService";
import { ERoleService } from "@/app/enums/services/admin/ERoleService";
import {
  ICreateRole,
  IUpdateRole,
} from "@/app/features/roles/types/role.interface";
import { instance } from "@/lib/axios";

export const rolesService = {
  createRole: (createRoleType: ICreateRole) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.ROLES}/${ERoleService.CREATE_ROLE}`;
    return instance.post(url, createRoleType);
  },

  updateRole: (updateRoleType: IUpdateRole) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.ROLES}/${ERoleService.UPDATE_ROLE}`;
    console.log(`update data:: ${JSON.stringify(updateRoleType)}`);
    return instance.patch(url, updateRoleType);
  },

  deleteRole: (id: string) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.ROLES}/${ERoleService.DELETE_ROLE}/${id}`;

    return instance.delete(url);
  },

  findAllRoles: (page: number, limit: number, all: string) => {
    const query = all === "true" ? "all=true" : `page=${page}&limit=${limit}`;
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.ROLES}/${ERoleService.FIND_ALL_ROLES}?${query}`;
    return instance.get(url);
  },

  findOneRole: (id: string) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.ROLES}/${id}`;
    return instance.get(url);
  },
};
