import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import {
  VERTICAL_VALUE,
  HORIZONTAL_VALUE,
  AUTO_HIDE_DURATION,
  ERROR_ALERT_TITLE,
  ERROR_ALERT_MESSAGE,
  ALERT_SEVERITY_ERROR,
  ALERT_VARIANT_FILLED,
  ALERT_WIDTH,
} from "../../../../../Consts/SubmitPopUpAlerts/consts";

const ErrorAlert = ({ open, onClose }) => {
  const verticalValue = VERTICAL_VALUE;
  const horizontalValue = HORIZONTAL_VALUE;
  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: verticalValue, horizontal: horizontalValue }}
        open={open}
        onClose={onClose}
        key={verticalValue + horizontalValue}
        autoHideDuration={AUTO_HIDE_DURATION}
      >
        <Alert
          onClose={onClose}
          severity={ALERT_SEVERITY_ERROR}
          variant={ALERT_VARIANT_FILLED}
          sx={{ width: ALERT_WIDTH }}
        >
          <AlertTitle>{ERROR_ALERT_TITLE}</AlertTitle>
          {ERROR_ALERT_MESSAGE}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ErrorAlert;
