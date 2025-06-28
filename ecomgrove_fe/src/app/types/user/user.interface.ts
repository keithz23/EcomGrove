export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface IUserSignup {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
}

export interface IUserUpdate {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  username: string | undefined;
  phone: string | undefined;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  userUpdate: IUserUpdate;
  otp: string;
}
