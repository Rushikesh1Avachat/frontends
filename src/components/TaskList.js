import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskTable from "./TaskTable.js";
import TaskModal from "./TaskModal.js";
import useTasks from "../hooks/useTasks.js";

/**
 * Main TaskList component - orchestrates the task management UI
 */
const TaskList = () => {
  const {
    tasks,
    loading,
    error,
    success,
    createTask,
    updateTask,
    deleteTask,
    downloadFile,
    clearSuccess,
    clearError,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Open modal for adding new task
  const handleAddTask = useCallback(() => {
    setSelectedTask(null);
    setModalOpen(true);
  }, []);

  // Open modal for editing task
  const handleEditTask = useCallback((task) => {
    setSelectedTask(task);
    setModalOpen(true);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTask(null);
  }, []);

  // Submit form (create or update)
  const handleSubmitTask = useCallback(
    async (formData, taskId) => {
      try {
        if (taskId) {
          // Update existing task
          await updateTask(taskId, formData);
        } else {
          // Create new task
          await createTask(formData);
        }
        handleCloseModal();
      } catch (error) {
        console.error("Error submitting task:", error);
      }
    },
    [createTask, updateTask, handleCloseModal]
  );

  // Delete task
  const handleDeleteTask = useCallback(
    async (taskId) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        try {
          await deleteTask(taskId);
        } catch (error) {
          console.error("Error deleting task:", error);
        }
      }
    },
    [deleteTask]
  );

  // Download file
  const handleDownloadFile = useCallback(
    (taskId, taskTitle) => {
      try {
        downloadFile(taskId, `${taskTitle}.pdf`);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    },
    [downloadFile]
  );

  // Mark task as done
  const handleMarkDone = useCallback(
    async (taskId) => {
      try {
        const formData = new FormData();
        formData.append("status", "DONE");
        await updateTask(taskId, formData);
      } catch (error) {
        console.error("Error marking task as done:", error);
      }
    },
    [updateTask]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
            sx={{
              backgroundColor: "white",
              color: "#1976d2",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Add Task
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Task Table */}
        <TaskTable
          tasks={tasks}
          loading={loading}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onDownload={handleDownloadFile}
          onMarkDone={handleMarkDone}
        />
      </Container>

      {/* Task Modal */}
      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        task={selectedTask}
        loading={loading}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={clearSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={clearSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskList;
