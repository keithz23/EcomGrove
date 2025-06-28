import { useState } from "react";
import { rolesService } from "@/app/services/admin";
import axios from "axios";
import { IRoles } from "../types/role.interface";

export function useRoleDetail() {
  const [role, setRole] = useState<IRoles | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRole = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesService.findOneRole(id);
      setRole(response.data.role);
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

  return { role, fetchRole, loading, error };
}
