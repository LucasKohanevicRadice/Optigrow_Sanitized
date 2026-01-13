import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import {
  VERTICAL_VALUE,
  HORIZONTAL_VALUE,
  AUTO_HIDE_DURATION,
  SUCCESS_ALERT_TITLE,
  SUCCESS_ALERT_MESSAGE,
  ALERT_SEVERITY_SUCCESS,
  ALERT_VARIANT_FILLED,
  ALERT_WIDTH,
} from "../../../../../Consts/SubmitPopUpAlerts/consts";

const SuccessAlert = ({ open, onClose }) => {
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
          severity={ALERT_SEVERITY_SUCCESS}
          variant={ALERT_VARIANT_FILLED}
          sx={{ width: ALERT_WIDTH }}
        >
          <AlertTitle>{SUCCESS_ALERT_TITLE}</AlertTitle>
          {SUCCESS_ALERT_MESSAGE}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuccessAlert;
