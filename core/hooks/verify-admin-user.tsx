"use client";
import { useEffect, useState } from "react";
import { UserDetail } from "../actions/user";

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        const result = await UserDetail();

        if (result.error) {
          setIsAdmin(false);
          setError(result.error);
        } else if (
          result.user?.role === "ADMIN" ||
          result.user?.role === "SUPERADMIN"
        ) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  return { isAdmin, loading, error };
};
