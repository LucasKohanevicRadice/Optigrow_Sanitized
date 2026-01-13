import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { setIsMobile } from "../../../features/applicationStateSlice";
import { setGrowEnvData } from "../../../features/growEnvSlice";
import { Box, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Sub-layouts
import Header from "../../../components/Header";
import DrawerDesktop from "../../../components/Drawer/DrawerDesktop";

// Constants
import { drawerWidth, headerHeight } from "../../../Styles/componentConstants";

// Hooks
import { useFetchGrowEnvs } from "../../../hooks/useGrowEnvs";

function Rootlayout() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const checkScreenSize = useMediaQuery(theme.breakpoints.down("md"));
  const { data: growEnvs, isLoading, isError } = useFetchGrowEnvs();

  useEffect(() => {
    dispatch(setIsMobile(checkScreenSize));
    if (growEnvs) {
      dispatch(setGrowEnvData(growEnvs));
    }
  }, [dispatch, checkScreenSize, growEnvs]);

  // Error display for growEnvs fetch
  if (isError) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "error.light",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: "center",
              p: 4,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h4" color="error" gutterBottom>
              Failed to load grow environments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please check your network connection or try again later.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1, height: headerHeight }}>
        <DrawerDesktop />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: `${headerHeight + 10}px`,
            display: "flex",
            flexDirection: "column",
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Container maxWidth="xl">
            {isLoading ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                }}
              >
                <span>Loading grow environments...</span>
              </Box>
            ) : (
              <Outlet />
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Rootlayout;
