export interface LoginProps {
  id?: number | string;
  firstName: string;
  lastName: string;
  username: string;
  role?: string;
  email: string;
  lastLogin?: Date;
  status?: string;
  profilePic: string;
  createdAt?: Date;
  token?: string;
}
