import { Chip } from "@mui/material";
import { getTaskStatus } from "../utils/taskStatus";

/**
 * Component to display task status with appropriate styling
 */
const TaskStatusBadge = ({ task }) => {
  const status = getTaskStatus(task);

  const statusConfig = {
    "In Progress": { label: "In Progress", color: "warning" },
    "Achieved": { label: "Achieved", color: "success" },
    "Failed": { label: "Failed", color: "error" },
    "DONE": { label: "DONE", color: "success" },
  };

  const config = statusConfig[status] || statusConfig["In Progress"];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="filled"
      sx={{
        fontWeight: "600",
        fontSize: "0.85rem",
      }}
    />
  );
};

export default TaskStatusBadge;
