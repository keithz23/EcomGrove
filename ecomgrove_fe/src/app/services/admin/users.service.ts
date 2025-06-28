import { EService } from "@/app/enums/EService";
import { EAdminService } from "@/app/enums/services/admin/EAdminService";
import { EUserService } from "@/app/enums/services/admin/EUserService";
import { instance } from "@/lib/axios";

export const usersService = {
  createUser(createUserType: FormData) {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.USERS}/${EUserService.CREATE_USER}`;
    return instance.post(url, createUserType);
  },

  updateUser(updateUserType: FormData) {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.USERS}/${EUserService.UPDATE_USER}`;

    return instance.patch(url, updateUserType);
  },

  deleteUser(id: string) {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.USERS}/${EUserService.DELETE_USER}/${id}`;
    return instance.delete(url);
  },

  findAllUser: (page: number, limit: number) => {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.USERS}/${EUserService.FIND_ALL_USER}?page=${page}&limit=${limit}`;
    return instance.get(url);
  },

  findOneUser(id: string) {
    const url = `${EService.ADMIN_SERVICE}/${EAdminService.USERS}/${id}`;
    return instance.get(url);
  },
};
