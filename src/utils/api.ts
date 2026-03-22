import axios from "axios";
import { notify } from "./notifications";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized (401) - redirect to login
    if (error.response?.status === 401) {
      // Clear any stored auth data if needed
      if (typeof window !== "undefined") {
        window.location.href = "/Login";
      }
    }

    // Handle forbidden (403)
    if (error.response?.status === 403) {
      notify.error("You don't have permission to perform this action");
    }

    // Handle not found (404)
    if (error.response?.status === 404) {
      notify.error("Resource not found");
    }

    // Handle validation errors (422 or 400)
    if (error.response?.status === 422 || error.response?.status === 400) {
      const message = error.response?.data?.error || "Validation failed. Please check your input.";
      notify.error(message);
    }

    // Handle server errors (500+)
    if (error.response?.status >= 500) {
      notify.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  options?: {
    showError?: boolean;
    showSuccess?: boolean;
    successMessage?: string;
  }
) => {
  const { showError = true, showSuccess = false, successMessage } = options || {};

  try {
    const response = await api({
      method,
      url,
      data,
    });

    if (showSuccess && successMessage) {
      notify.success(successMessage);
    }

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    if (showError) {
      notify.error(message);
    }

    throw new Error(message);
  }
};

// Utility function for promise-based API calls with toast
export const apiWithNotification = async <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error?: string;
  }
): Promise<T> => {
  return notify.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error || "Something went wrong",
  }) as unknown as T;
};

export default api;
