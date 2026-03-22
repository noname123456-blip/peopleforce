"use client";

import { useState } from "react";
import { apiRequest } from "@/utils/api";
import { notify } from "@/utils/notifications";

export function useUpdate<T, D = any>(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    id: string,
    data: D,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      showNotification?: boolean;
    }
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest("PUT", `${endpoint}/${id}`, data, {
        showError: false,
      });

      if (options?.showNotification !== false) {
        const message = options?.successMessage || "Record updated successfully";
        notify.success(message);
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update record";
      setError(errorMessage);

      if (options?.showNotification !== false) {
        const message = options?.errorMessage || errorMessage;
        notify.error(message);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
