import React from "react"

// Material-ui
import { Drawer, Box } from "@mui/material"

// Consts
import { drawerWidth } from "../../Styles/componentConstants"
import DrawerContent from "./DrawerContent"

const DrawerMobile = ({
  drawerOpen,
  handleDrawerToggle,
  handleDrawerTransitionEnd,
}) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component='nav'
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label='mailbox folders'
      >
        <Drawer
          variant='temporary'
          open={drawerOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", md: "none" }, // Show on mobile, hide on desktop
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <DrawerContent />
        </Drawer>
      </Box>
    </Box>
  )
}

export default DrawerMobile
