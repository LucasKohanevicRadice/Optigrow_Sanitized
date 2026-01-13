import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFetchGrowEnvs } from "../../../hooks/useGrowEnvs.js";
import {
  Container,
  Grid,
  Grid2,
  Box,
  Typography,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Grow,
} from "@mui/material";

import { LineChart } from "@mui/x-charts";
import { PriorityHigh } from "@mui/icons-material";

import mockGrowEnviroments from "../../../db/mockGrowEnviroments.js";
import sensorTabsContent from "./sensorTabsContent/sensorTabsContent.js";

const GrowEnviromentDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const growEnvironmentData = useSelector((state) =>
    (state.growEnvironmentsState.growEnvData || []).find(
      (growEnv) => growEnv._id === id
    )
  );
  const [activeTab, setActiveTab] = useState(0);

  if (!growEnvironmentData) {
    return <Typography variant="h5">Grow Environment not found</Typography>;
  }

  const sensorTabs = sensorTabsContent(growEnvironmentData);

  return (
    <>
      <Box>
        <Container maxWidth="xl">
          <Box sx={{ position: "relative", width: "100%", mb: 3 }}>
            <Box
              component="img"
              src={growEnvironmentData.imageMetaData.url}
              alt={growEnvironmentData.growEnvName}
              sx={{
                width: "100%",
                height: 300,
                objectFit: "cover",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                border: "1px solid #e0e0e0",
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "white",
                "&:hover": { bgcolor: "white" },
              }}
            >
              <PriorityHigh />
            </IconButton>
            {/* TO DO: Liitä iconButton if needsAttention */}
          </Box>
          <Grid container sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h4">
                {growEnvironmentData.growEnvName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {growEnvironmentData.species}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {sensorTabs.map((sensor, index) => (
              <Grid item xs={12} sm={4} key={sensor.label}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <sensor.icon color={theme.palette.primary.main} />
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="div"
                    >
                      Current {sensor.label}
                    </Typography>
                    <Typography variant="h6" component="div">
                      {sensor.value}
                      {sensor.unit}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, selectedTab) => setActiveTab(selectedTab)}
            >
              {sensorTabs.map((sensor) => (
                <Tab
                  key={sensor.label}
                  label={sensor.label}
                  icon={<sensor.icon />}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>
          <Box sx={{ mb: 4, height: 400 }}>
            <LineChart
              dataset={sensorTabs[activeTab].data}
              xAxis={[
                {
                  id: "days",
                  dataKey: "dateTime",
                  scaleType: "time",
                  valueFormatter: (date) => {
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
                  },
                },
              ]}
              series={[
                {
                  id: "value",
                  label: sensorTabs[activeTab].label,
                  dataKey: sensorTabs[activeTab].dataKey,
                },
              ]}
            />
            ;
          </Box>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.primary.main + "10",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" component="div" gutterBottom>
                Optimal Ranges
              </Typography>
              <Grid container spacing={2}>
                {sensorTabs.map((sensor) => (
                  <Grid item xs={12} sm={4} key={sensor.label}>
                    <Typography
                      fontWeight={"medium"}
                      variant="body4"
                      component="div"
                    >
                      {sensor.label}: {sensor.range && typeof sensor.range.min === "number" && typeof sensor.range.max === "number"
                        ? `${sensor.range.min}${sensor.unit} - ${sensor.range.max}${sensor.unit}`
                        : "Optimal range not available"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default GrowEnviromentDetails;
