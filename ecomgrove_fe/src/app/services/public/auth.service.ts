import { instance } from "@/lib/axios";
import { IChangePassword, IUserSignup } from "@/app/types/user/user.interface";
import { EAuthService } from "@/app/enums/services/auth/EAuthService";
import { EService } from "@/app/enums/EService";
import { AxiosRequestHeaders } from "axios";

export const authService = {
  signup: (data: IUserSignup) => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.SIGNUP_SERVICE}`;
    return instance.post(url, data);
  },

  login: (email: string, password: string) => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.LOGIN_SERVICE}`;
    return instance.post(url, { email, password });
  },

  logout: () => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.LOGOUT_SERVICE}`;
    return instance.post(url);
  },

  profile: () => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.PROFILE_SERVICE}`;
    return instance.get(url);
  },

  changePassword: (payload: IChangePassword, headers: AxiosRequestHeaders) => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.CHANGE_PASSWORD}`;
    return instance.post(url, payload, { headers });
  },

  checkAuth: () => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.CHECKAUTH_SERVICE}`;
    return instance.get(url);
  },

  refresh: () => {
    const url = `${EService.AUTH_SERVICE}/${EAuthService.REFRESH}`;
    return instance.post(url);
  },
};
