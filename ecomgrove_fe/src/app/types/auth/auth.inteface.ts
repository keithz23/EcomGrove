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
