"use client";

import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";

import usePermissionGroup from "@/app/features/permissions/hooks/usePermissionGroup";
import useRole from "@/app/features/roles/hooks/useRole";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const CheckboxCellRenderer = (props: any) => {
  if (props.data?.isGroupHeader) return null;
  return (
    <input
      type="checkbox"
      checked={!!props.value}
      disabled
      style={{ pointerEvents: "none" }}
    />
  );
};

export default function PermissionsMatrix() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);

  const { roles: rolesData = [], loading: rolesLoading } = useRole(
    page,
    limit,
    "true"
  );
  const { permissionGroup: permissionGroups = [], loading: groupsLoading } =
    usePermissionGroup(page, limit, "true");

  // 📊 Chuẩn bị rowData: từng dòng là permission hoặc group header
  const rowData = useMemo(() => {
    const rows: Record<string, any>[] = [];

    permissionGroups.forEach((group) => {
      // 👉 Dòng tiêu đề group (sử dụng colSpan)
      rows.push({
        isGroupHeader: true,
        name: "🔷 " + group.name.toUpperCase(),
      });

      // 👉 Các quyền trong group
      group.permissions.forEach((permission) => {
        const row: Record<string, any> = {
          isGroupHeader: false,
          name: permission.displayName,
        };

        rolesData.forEach((role) => {
          const hasPermission = role.permissions?.some(
            (rolePerm) => rolePerm.id === permission.id
          );
          row[role.name] = hasPermission;
        });

        rows.push(row);
      });
    });

    return rows;
  }, [permissionGroups, rolesData]);

  // 📐 Khai báo cột
  const colDefs = useMemo(
    () => [
      {
        headerName: "Permission",
        field: "name",
        pinned: "left" as const,
        width: 250,
        colSpan: (params: any) =>
          params.data?.isGroupHeader ? rolesData.length + 1 : 1,
        cellStyle: (params: any) =>
          params.data?.isGroupHeader
            ? { fontWeight: "bold", backgroundColor: "#f5f5f5" }
            : { fontWeight: "normal", backgroundColor: "" },
      },
      ...rolesData.map((role) => ({
        headerName: role.name,
        field: role.name,
        width: 120,
        cellRenderer: CheckboxCellRenderer,
        cellStyle: { textAlign: "center" },
      })),
    ],
    [rolesData]
  );

  if (rolesLoading || groupsLoading) return <p>Loading...</p>;

  return (
    <div
      className="ag-theme-quartz"
      style={{
        height: 600,
        width: "100%",
      }}
    >
      <AgGridReact
        key={rolesData.length}
        rowData={rowData}
        columnDefs={colDefs}
        domLayout="normal"
        suppressMovableColumns
        suppressCellFocus
        suppressColumnVirtualisation={false}
        suppressRowVirtualisation={false}
        animateRows={false}
      />
    </div>
  );
}
