import { useCallback, useEffect, useState } from "react";
import { usersService } from "@/app/services/admin";
import { UsersInterface } from "@/app/types/admin/users.interface";
import { getErrorMessage } from "@/app/utils/getMessageError.util";

export function useUsers(page: number, limit: number) {
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersService.findAllUser(page, limit);
      const resData = res.data;
      setUsers(resData.data);
      setTotalPages(resData.totalPages);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, totalPages, loading, error, refetch: fetchUsers };
}
