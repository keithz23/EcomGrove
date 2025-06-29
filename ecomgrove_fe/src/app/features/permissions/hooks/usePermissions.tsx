import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { IPermissions } from "../types/permissions.interface";
import { permissionsService } from "@/app/services/admin/permissions.service";

export default function usePermissions(
  page: number,
  limit: number,
  all: string
) {
  const [permissions, setPermissions] = useState<IPermissions[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await permissionsService.findAllPermissions(page, limit, all);
      const resData = res.data;
      setPermissions(resData.data);
      setTotalPages(resData.totalPages);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);
  return { permissions, totalPages, loading, error, refetch: fetchPermissions };
}
