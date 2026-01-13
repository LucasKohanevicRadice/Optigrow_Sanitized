import { Typography, Box, Tooltip } from "@mui/material";

const SensorReading = ({ icon: Icon, value, label, unit, isWarning }) => {
  return (
    <Tooltip title={`${label}: ${value}${unit}`}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Icon fontSize="small" color={isWarning ? "error" : "success"} />
        <Typography
          variant="body2"
          component="div"
          color={isWarning ? "error.dark" : "text.primary"}
          fontWeight={isWarning ? 600 : 400}
        >
          {value}
          {unit}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default SensorReading;
