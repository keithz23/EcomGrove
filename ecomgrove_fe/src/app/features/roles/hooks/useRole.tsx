import React, { useCallback, useEffect, useState } from "react";
import { IRoles } from "../types/role.interface";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { rolesService } from "@/app/services/admin";

export default function useRole(page: number, limit: number, all: string) {
  const [roles, setRoles] = useState<IRoles[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rolesService.findAllRoles(page, limit, all);
      const resData = res.data;
      setRoles(resData.data);
      setTotalPages(resData.totalPages);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);
  return { roles, totalPages, loading, error, refetch: fetchRoles };
}
