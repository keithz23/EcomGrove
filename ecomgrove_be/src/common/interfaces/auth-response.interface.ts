export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  status: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    roles?: string[];
    googleId?: string;
    picture?: string;
    permissions?: string[];
  };
}
