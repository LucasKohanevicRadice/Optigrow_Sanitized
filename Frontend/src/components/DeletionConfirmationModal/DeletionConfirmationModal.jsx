import { useState } from "react";
import { useDeleteGrowEnvById } from "../../hooks/useGrowEnvs";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import {
  DELETION_CONFIRMATION_TEXT,
  DELETION_CONFIRMATION_TITLE,
} from "../../Consts/DeletionConfirmationModal/Consts";

const DeletionConfirmationModal = ({
  open,
  id,
  onDeleteConfirmed,
  onClose,
}) => {
  const { mutate: deleteGrowEnv } = useDeleteGrowEnvById();

  const handleDelete = () => {
    deleteGrowEnv(id);
    if (onDeleteConfirmed) onDeleteConfirmed();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {DELETION_CONFIRMATION_TITLE}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {DELETION_CONFIRMATION_TEXT}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} autoFocus color="error">
          DELETE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletionConfirmationModal;
