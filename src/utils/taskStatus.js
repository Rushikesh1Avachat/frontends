/**
 * Calculate the display status of a task based on its current status, creation date, and deadline
 * @param {Object} task - Task object with status, createdOn, and deadline
 * @returns {string} - Display status: "In Progress", "Achieved", "Failed", or "DONE"
 */
export const getTaskStatus = (task) => {
  if (!task || !task.deadline) {
    return "Unknown";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(task.deadline);
  deadline.setHours(0, 0, 0, 0);

  const createdOn = new Date(task.createdOn || new Date());
  createdOn.setHours(0, 0, 0, 0);

  // If task is marked as DONE
  if (task.status === "DONE") {
    // If today is after deadline and task is done before deadline, show "Achieved"
    return deadline < today ? "Achieved" : "DONE";
  }

  // If today is on or after deadline and task is not completed
  if (today >= deadline) {
    return "Failed";
  }

  // If today is between creation and deadline
  return "In Progress";
};

/**
 * Get color for status badge
 * @param {string} status - Status string
 * @returns {string} - Color for MUI components
 */
export const getStatusColor = (status) => {
  const statusColors = {
    "In Progress": "warning",
    "Achieved": "success",
    "Failed": "error",
    "DONE": "success",
  };
  return statusColors[status] || "default";
};

/**
 * Format date for display
 * @param {string | Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Parse date string from input (assumes format dd/mm/yyyy or yyyy-mm-dd)
 * @param {string} dateString - Date string to parse
 * @returns {Date} - Parsed date object
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // Handle yyyy-mm-dd format (from date input)
  if (dateString.includes("-")) {
    return new Date(dateString);
  }
  
  // Handle dd/mm/yyyy format
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day);
  }
  
  return new Date(dateString);
};
