import { format, formatDistanceToNow, parseISO } from "date-fns";

// Date Formatting
export const formatDate = (date: Date | string | null | undefined, formatStr: string = "MMM dd, yyyy"): string => {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return "Invalid Date";
  }
};

// Time Formatting
export const formatTime = (time: string | null | undefined, formatStr: string = "HH:mm"): string => {
  if (!time) return "N/A";
  try {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return format(date, formatStr);
  } catch {
    return "Invalid Time";
  }
};

// Date and Time Formatting
export const formatDateTime = (date: Date | string | null | undefined, formatStr: string = "MMM dd, yyyy HH:mm"): string => {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return "Invalid Date";
  }
};

// Relative Time (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date | string | null | undefined): string => {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "Invalid Date";
  }
};

// Currency Formatting
export const formatCurrency = (amount: number | string | null | undefined, currency: string = "USD"): string => {
  if (amount === null || amount === undefined || amount === "") return "N/A";
  try {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return "N/A";
  }
};

// Phone Formatting
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return "N/A";
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length > 11) {
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }

  return phone;
};

// Number Formatting (with commas)
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === "") return "N/A";
  try {
    const number = typeof num === "string" ? parseFloat(num) : num;
    return new Intl.NumberFormat("en-US").format(number);
  } catch {
    return "N/A";
  }
};

// Percentage Formatting
export const formatPercentage = (value: number | string | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  try {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return `${num.toFixed(decimals)}%`;
  } catch {
    return "N/A";
  }
};

// Get Initials from Name
export const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined): string => {
  const first = (firstName || "").charAt(0).toUpperCase();
  const last = (lastName || "").charAt(0).toUpperCase();
  return `${first}${last}`.substring(0, 2) || "?";
};

// Get Display Name
export const getDisplayName = (firstName: string | null | undefined, lastName: string | null | undefined): string => {
  if (!firstName && !lastName) return "Unknown";
  return `${firstName || ""} ${lastName || ""}`.trim();
};

// Status Badge Formatting
export const formatStatus = (status: string): { label: string; color: string } => {
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "bg-green-100 text-green-800" },
    inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Approved", color: "bg-green-100 text-green-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
    draft: { label: "Draft", color: "bg-blue-100 text-blue-800" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Completed", color: "bg-green-100 text-green-800" },
    failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    hired: { label: "Hired", color: "bg-green-100 text-green-800" },
    applied: { label: "Applied", color: "bg-blue-100 text-blue-800" },
    interview: { label: "Interview", color: "bg-purple-100 text-purple-800" },
    test: { label: "Test", color: "bg-indigo-100 text-indigo-800" },
    offer_sent: { label: "Offer Sent", color: "bg-green-100 text-green-800" },
    on_draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
    meeting: { label: "Meeting", color: "bg-blue-100 text-blue-800" },
    sick_leave: { label: "Sick Leave", color: "bg-red-100 text-red-800" },
    casual_leave: { label: "Casual Leave", color: "bg-blue-100 text-blue-800" },
    earned_leave: { label: "Earned Leave", color: "bg-green-100 text-green-800" },
    first_half: { label: "First Half", color: "bg-yellow-100 text-yellow-800" },
    second_half: { label: "Second Half", color: "bg-yellow-100 text-yellow-800" },
    full_day: { label: "Full Day", color: "bg-red-100 text-red-800" },
    requested: { label: "Requested", color: "bg-yellow-100 text-yellow-800" },
    present: { label: "Present", color: "bg-green-100 text-green-800" },
    absent: { label: "Absent", color: "bg-red-100 text-red-800" },
    late: { label: "Late", color: "bg-yellow-100 text-yellow-800" },
    on_site: { label: "On Site", color: "bg-blue-100 text-blue-800" },
    remote: { label: "Remote", color: "bg-purple-100 text-purple-800" },
    hybrid: { label: "Hybrid", color: "bg-indigo-100 text-indigo-800" },
  };

  return statusMap[status.toLowerCase()] || { label: status, color: "bg-gray-100 text-gray-800" };
};

// File Size Formatting
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Duration Formatting (e.g., "2 days 3 hours")
export const formatDuration = (milliseconds: number | null | undefined): string => {
  if (!milliseconds) return "0ms";

  const ms = Math.abs(milliseconds);
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
};

// Truncate Text
export const truncate = (text: string | null | undefined, length: number = 50): string => {
  if (!text) return "N/A";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Capitalize First Letter
export const capitalize = (text: string | null | undefined): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// CamelCase to Sentence
export const camelCaseToSentence = (text: string): string => {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Snake Case to Title Case
export const snakeCaseToTitleCase = (text: string): string => {
  return text
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
};

// Array to Readable List
export const formatList = (items: string[], separator: string = ", ", lastSeparator: string = " and "): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(lastSeparator);
  return items.slice(0, -1).join(separator) + lastSeparator + items[items.length - 1];
};
