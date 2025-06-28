export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserRoles {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
}

export interface UsersInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  username: string;
  phone: string;
  isActive: string;
  lastLoginAt: string;
  createdAt: string;
  password?: string;
  userRoles: UserRoles[];
}
