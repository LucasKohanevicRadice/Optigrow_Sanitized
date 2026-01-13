import React from "react";

// Material-ui
import { Drawer, Box, Toolbar } from "@mui/material";
import DrawerContent from "./DrawerContent";

// Consts
import { drawerWidth } from "../../Styles/componentConstants";

const DrawerDesktop = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" }, // Show on desktop, hide on mobile
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <DrawerContent />
      </Drawer>
    </Box>
  );
};
export default DrawerDesktop;
