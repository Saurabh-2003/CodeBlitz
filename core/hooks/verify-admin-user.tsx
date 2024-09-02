// /hooks/useAdminCheck.js
import { useEffect, useState } from "react";
import { UserDetail } from "../actions";

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        const result = await UserDetail();

        if (result.error) {
          setIsAdmin(false);
          setError(result?.error);
        } else if (result.user?.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error: any) {
        setError(error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  return { isAdmin, loading, error };
};