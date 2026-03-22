"use client";

import { useState } from "react";
import { apiRequest } from "@/utils/api";
import { notify } from "@/utils/notifications";

export function useDelete(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delete_item = async (
    id: string,
    options?: {
      confirmMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      showNotification?: boolean;
    }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await apiRequest("DELETE", `${endpoint}/${id}`, undefined, {
        showError: false,
      });

      if (options?.showNotification !== false) {
        const message = options?.successMessage || "Record deleted successfully";
        notify.success(message);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete record";
      setError(errorMessage);

      if (options?.showNotification !== false) {
        const message = options?.errorMessage || errorMessage;
        notify.error(message);
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { delete: delete_item, loading, error };
}
