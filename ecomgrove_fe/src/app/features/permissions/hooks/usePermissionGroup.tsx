import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { permissionsService } from "@/app/services/admin/permissions.service";
import { IPermissionGroup } from "../types/permission-group.interface";

export default function usePermissionGroup(
  page: number,
  limit: number,
  all: string
) {
  const [permissionGroup, setPermissionGroup] = useState<IPermissionGroup[]>(
    []
  );
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissionGroup = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await permissionsService.findAllPermissionGroup(
        page,
        limit,
        all
      );
      const resData = res.data;
      setPermissionGroup(resData.data);
      setTotalPages(resData.totalPages);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPermissionGroup();
  }, [fetchPermissionGroup]);
  return {
    permissionGroup,
    totalPages,
    loading,
    error,
    refetch: fetchPermissionGroup,
  };
}
