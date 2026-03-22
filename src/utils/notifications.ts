import { toast } from "sonner";

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      duration: 3000,
      position: "top-right",
    }),

  error: (message: string) =>
    toast.error(message, {
      duration: 4000,
      position: "top-right",
    }),

  warning: (message: string) =>
    toast.warning(message, {
      duration: 3000,
      position: "top-right",
    }),

  info: (message: string) =>
    toast.info(message, {
      duration: 3000,
      position: "top-right",
    }),

  loading: (message: string) =>
    toast.loading(message, {
      position: "top-right",
    }),

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => toast.promise(promise, messages),

  dismiss: (toastId?: string | number) => toast.dismiss(toastId),
};
