import { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Settings from "@mui/icons-material/Settings";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import DeletionConfirmationModal from "../DeletionConfirmationModal/DeletionConfirmationModal";

import {
  DELETE_GROW_ENV_LABEL,
  MODIFY_OPTIMAL_RANGES_LABEL,
  GROW_ENV_SETTINGS_LABEL,
} from "../../Consts/GrowEnvMenuButton/consts";

const GrowEnvMenuButton = ({ id }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deletionModalOpen, setDeletionModalOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setDeletionModalOpen(true);
  };

  const handleDeleteConfirmed = () => {
    setDeletionModalOpen(false);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Grow environment settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            ml: 2,
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
          }}
          aria-controls={open ? "growEnv-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 40, height: 40 }}>
            <EditTwoToneIcon />
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="growEnv-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {GROW_ENV_SETTINGS_LABEL}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EditTwoToneIcon fontSize="small" />
          </ListItemIcon>
          {MODIFY_OPTIMAL_RANGES_LABEL}
        </MenuItem>
        <MenuItem onClick={handleOpenModal}>
          <ListItemIcon>
            <DeleteTwoToneIcon fontSize="small" />
          </ListItemIcon>
          {DELETE_GROW_ENV_LABEL}
        </MenuItem>
      </Menu>
      <DeletionConfirmationModal
        open={deletionModalOpen}
        id={id}
        onDeleteConfirmed={handleDeleteConfirmed}
        onClose={() => setDeletionModalOpen(false)}
      />
    </>
  );
};

export default GrowEnvMenuButton;
