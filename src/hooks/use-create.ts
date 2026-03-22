"use client";

import { useState } from "react";
import { apiRequest } from "@/utils/api";
import { notify } from "@/utils/notifications";

export function useCreate<T, D = any>(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (
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
      const response = await apiRequest("POST", endpoint, data, {
        showError: false,
      });

      if (options?.showNotification !== false) {
        const message = options?.successMessage || "Record created successfully";
        notify.success(message);
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create record";
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

  return { create, loading, error };
}
