import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Material-ui
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
} from "@mui/material";
import {
  AddCircleOutlined,
  SubjectOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";

const DrawerContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      id: 1,
      text: "Overview",
      icon: <SubjectOutlined sx={{ color: "green" }} />,
      path: "/",
    },
    {
      id: 2,
      text: "Create",
      icon: <AddCircleOutlined sx={{ color: "green" }} />,
      path: "/createGrowEnviroments",
    },
  ];

  return (
    <Box sx={{ overflow: "auto" }}>
      <Typography
        variant="h5"
        sx={{ color: "green", fontWeight: "bold", textAlign: "Center" }}
      >
        OptiGro Logo
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            sx={{
              backgroundColor:
                location.pathname === item.path
                  ? "rgba(0, 0, 0, 0.08)"
                  : "inherit",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemButton
              onClick={() => {
                navigate(item.path);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
export default DrawerContent;
