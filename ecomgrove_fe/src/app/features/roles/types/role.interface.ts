import {
  IPermissions,
  IRolePermissions,
} from "../../permissions/types/permissions.interface";

export interface IRoles {
  id?: string;
  name: string;
  description: string;
  createdAt: string;
  permissions: IPermissions[];
  rolePermissions: IRolePermissions[];
}

export interface ICreateRole {
  name: string;
  description: string;
}

export interface IUpdateRole extends ICreateRole {
  id: string;
}
