import { EService } from "@/app/enums/EService";
import { EUsersService } from "@/app/enums/services/users/EUsersService";
import { instance } from "@/lib/axios";

export const usersService = {
  uploadAvatar: (formData: FormData) => {
    const url = `${EService.USER_SERVICE}/${EUsersService.UPLOAD_AVATAR}`;
    return instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
