import  { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { formatDate } from "../utils/taskStatus.js";

/**
 * Modal component for adding and editing tasks
 */
const TaskModal = ({
  open,
  onClose,
  onSubmit,
  task = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        deadline: task.deadline ? task.deadline.split("T")[0] : "", // Convert to yyyy-mm-dd format
      });
    } else {
      setFormData({
        title: "",
        description: "",
        deadline: "",
      });
    }
    setFile(null);
    setErrors({});
  }, [task, open]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type (PDF only)
      if (selectedFile.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          file: "Only PDF files are allowed",
        }));
        return;
      }
      setFile(selectedFile);
      if (errors.file) {
        setErrors((prev) => ({
          ...prev,
          file: "",
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("deadline", formData.deadline);

    if (file) {
      submitData.append("linkedFile", file);
    }

    try {
      await onSubmit(submitData, task?._id);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Title Field */}
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
            placeholder="Enter task title"
          />

          {/* Description Field */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
            placeholder="Enter task description"
          />

          {/* Deadline Field */}
          <TextField
            label="Deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleInputChange}
            fullWidth
            error={!!errors.deadline}
            helperText={errors.deadline}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* File Upload */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Upload PDF (Optional)
            </Typography>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 1,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "#1976d2",
                  backgroundColor: "#f0f7ff",
                },
              }}
              component="label"
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <Typography variant="body2">
                {file ? file.name : "Click to upload or drag and drop"}
              </Typography>
              {!file && (
                <Typography variant="caption" sx={{ color: "#666" }}>
                  PDF files only
                </Typography>
              )}
            </Box>
            {errors.file && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                {errors.file}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ position: "relative" }}
        >
          {loading ? <CircularProgress size={24} /> : task ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
