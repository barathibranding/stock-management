export function getErrorMessage(error) {
  if (!error) return "An unexpected error occurred.";
  if (typeof error === "string") return error;

  const data = error.response?.data;
  if (!data) {
    if (error.message) return error.message;
    return "Network error. Please check your connection.";
  }

  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.message) return data.message;
  if (data.error) return data.error;
  if (Array.isArray(data)) return data.join(", ");

  // If it's an object with field errors
  const entries = Object.entries(data);
  if (entries.length > 0) {
    const [field, value] = entries[0];
    const message = Array.isArray(value) ? value[0] : value;
    return field === "non_field_errors"
      ? String(message)
      : `${field}: ${message}`;
  }

  return "An unexpected error occurred.";
}
