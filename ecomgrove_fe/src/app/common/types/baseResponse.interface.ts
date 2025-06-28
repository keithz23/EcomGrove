export interface BaseResponse<T = any> {
  status: number;
  message?: string;
  data: T;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}
