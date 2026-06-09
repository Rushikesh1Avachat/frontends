import axios from "axios";

// Set base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL ;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Task API endpoints
export const taskAPI = {
  // Fetch all tasks
  getAllTasks: () => {
    return api.get("/tasks");
  },

  // Create a new task with optional file
  createTask: (taskData) => {
    return api.post("/tasks", taskData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update an existing task
  updateTask: (id, taskData) => {
    return api.put(`/tasks/${id}`, taskData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete a task
  deleteTask: (id) => {
    return api.delete(`/tasks/${id}`);
  },

  // Get task details
  getTask: (id) => {
    return api.get(`/tasks/${id}`);
  },

  // Download file associated with a task
  downloadFile: (id) => {
    return api.get(`/tasks/${id}/file`, {
      responseType: "blob",
    });
  },
};

export default api;
