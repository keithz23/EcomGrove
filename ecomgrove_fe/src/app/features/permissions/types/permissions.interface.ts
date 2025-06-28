export interface IPermissions {
  id?: string;
  displayName: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  rolePermissions: IRolePermissions[];
}

export interface IRolePermissions {
  id?: string;
  roleId: string;
  permissionId: string;
}
