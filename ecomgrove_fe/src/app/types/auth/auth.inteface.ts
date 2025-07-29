import { BaseResponse } from "@/app/common/types/baseResponse.interface";
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  roles: string;
}

export type AuthResponse = BaseResponse<{ user: User }>;

export interface LoginWithGoogleResponse {
  clientId: string;
  crendential: string;
  selectBy?: string;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  picture: string;
  lastLoginAt: Date;
  googleId?: string;
}
