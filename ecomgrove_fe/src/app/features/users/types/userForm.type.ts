export type UserRole = "Admin" | "Customer" | "Manager";
export type UserStatus = "Active" | "Inactive";

export type NewUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  username: string;
  role: string;
  status: UserStatus;
  picture: File;
};
