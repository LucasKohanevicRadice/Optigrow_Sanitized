import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Grid,
  Box,
  Divider,
  IconButton,
  Icon,
} from "@mui/material";

import {
  PlaceTwoTone,
  Place,
  WaterDrop,
  ThermostatTwoTone,
  PriorityHigh,
  ElectricBolt,
  Science,
} from "@mui/icons-material";

import SensorReading from "./SensorReading";

import GrowEnvMenuButton from "../GrowEnvMenuButton/GrowEnvMenuButton";

import {
  GROW_ENV_NAVIGATION_PATH,
  SENSOR_READING_HUMIDITY_LABEL,
  SENSOR_READING_HUMIDITY_UNIT,
  SENSOR_READING_TEMPERATURE_LABEL,
  SENSOR_READING_TEMPERATURE_UNIT,
  SENSOR_READING_EC_LABEL,
  SENSOR_READING_EC_UNIT,
  SENSOR_READING_PH_UNIT,
  SENSOR_READING_PH_LABEL,
} from "../../Consts/GrowEnvironmentCard/consts";

const GrowEnviromentCard = ({
  id,
  plantSpecies,
  plantName,
  location,
  humidity,
  ph,
  ec,
  temperature,
  optimalRange,
  lastWatered,
  image,
}) => {
  // Returns true if any reading is outside of optimal range
  const checkRange = (value, range) => {
    if (
      !range ||
      typeof range.min !== "number" ||
      typeof range.max !== "number"
    ) {
      return false;
    }
    return value < range.min || value > range.max;
  };
  console.log("humidity:", humidity);

  const needsAttention =
    checkRange(humidity, optimalRange.humidity) ||
    checkRange(ph, optimalRange.ph) ||
    checkRange(ec, optimalRange.ec);
  return (
    <Card
      sx={{
        // minWidth: 300,
        // maxWidth: "100%",
        width: 300,
        height: 520, // Set a fixed height for all cards
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
        bgcolor: needsAttention ? "warning.light" : "",
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={image}
        alt={plantSpecies}
        sx={{ objectFit: "cover" }}
      />
      <GrowEnvMenuButton id={id} />
      {needsAttention && (
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            bgcolor: "white",
            "&:hover": { bgcolor: "white" },
          }}
          onClick={() => {
            // TO DO , create a modal that gives users tips on counteracting the current issue
          }}
        >
          <PriorityHigh color="error" />
        </IconButton>
      )}
      <Link
        to={`${GROW_ENV_NAVIGATION_PATH}${id}`}
        style={{ textDecoration: "none" }}
      >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {plantName}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              {plantSpecies}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PlaceTwoTone color="success" />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {location}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <SensorReading
                icon={WaterDrop}
                value={humidity}
                label={SENSOR_READING_HUMIDITY_LABEL}
                unit="%"
                isWarning={checkRange(humidity, optimalRange.humidity)}
              />
              <SensorReading
                icon={Science}
                value={ph}
                label={SENSOR_READING_PH_LABEL}
                unit={SENSOR_READING_PH_UNIT}
                isWarning={checkRange(ph, optimalRange.ph)}
              />
              <SensorReading
                icon={ElectricBolt}
                value={ec}
                label={SENSOR_READING_EC_LABEL}
                unit={SENSOR_READING_EC_UNIT}
                isWarning={checkRange(ec, optimalRange.ec)}
              />
              <SensorReading
                icon={ThermostatTwoTone}
                value={temperature}
                label={SENSOR_READING_TEMPERATURE_LABEL}
                unit={SENSOR_READING_TEMPERATURE_UNIT}
                isWarning={checkRange(temperature, optimalRange.temperature)}
              />
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default GrowEnviromentCard;
