import { useState, useEffect, useCallback } from "react";
import { taskAPI } from "../services/api";

/**
 * Custom hook to manage task state and API calls
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.getAllTasks();
      setTasks(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch tasks";
      setError(errorMessage);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setSuccess("Task created successfully!");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create task";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? response.data : task))
      );
      setSuccess("Task updated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update task";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await taskAPI.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setSuccess("Task deleted successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete task";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Download file
  const downloadFile = useCallback(async (id, filename) => {
    try {
      const response = await taskAPI.downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "file.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to download file";
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Clear success message
  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    success,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    downloadFile,
    clearSuccess,
    clearError,
  };
};

export default useTasks;
