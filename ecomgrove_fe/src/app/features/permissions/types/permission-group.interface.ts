import { IPermissions } from "./permissions.interface";

export interface IPermissionGroup {
  id?: string;
  name: string;
  description: string;
  permissions: IPermissions[];
}
