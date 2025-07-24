import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/app/utils/getMessageError.util";
import { IProfile } from "../types/auth/auth.inteface";
import { authService } from "../services/public/auth.service";

export default function useProfile() {
  const [profile, setProfile] = useState<IProfile>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.profile();
      const resData = res.data;
      setProfile(resData.data);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  return { profile, loading, error, refetch: fetchProfile };
}
