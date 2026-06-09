import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Tooltip,
  CircularProgress,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskStatusBadge from "./TaskStatusBadge.js";
import { formatDate } from "../utils/taskStatus.js";

/**
 * Table component to display tasks
 */
const TaskTable = ({
  tasks = [],
  loading = false,
  onEdit,
  onDelete,
  onDownload,
  onMarkDone,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 8,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No tasks found!
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Deadline</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
              Status
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow
              key={task._id || index}
              sx={{
                "&:hover": { backgroundColor: "#f5f5f5" },
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{formatDate(task.deadline)}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <TaskStatusBadge task={task} />
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                  {task.status !== "DONE" && (
                    <Tooltip title="Mark as Done">
                      <IconButton
                        size="small"
                        onClick={() => onMarkDone(task._id)}
                        color="success"
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {task.linkedFile && (
                    <Tooltip title="Download File">
                      <IconButton
                        size="small"
                        onClick={() => onDownload(task._id, task.title)}
                        color="primary"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(task)}
                      color="info"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(task._id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
