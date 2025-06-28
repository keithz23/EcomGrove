import { useState } from "react";
import { usersService } from "@/app/services/admin";
import { UsersInterface } from "@/app/types/admin/users.interface";
import axios from "axios";

export function useUserDetail() {
  const [user, setUser] = useState<UsersInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.findOneUser(id);
      setUser(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Server error");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return { user, fetchUser, loading, error };
}
