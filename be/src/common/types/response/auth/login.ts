import { LoginProps } from '../../auth/login';

export interface LoginResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: LoginProps;
}
