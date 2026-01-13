import { useSelector } from "react-redux";
import _ from "lodash";
import { Grid, Box, Container } from "@mui/material";
import GrowEnviromentCard from "../../../components/GrowEnvironmentCard/GrowEnvironmentCard";

import {
  HUMIDITY_VALUE_NOT_AVAILABLE,
  PH_VALUE_NOT_AVAILABLE,
  EC_VALUE_NOT_AVAILABLE,
  TEMPERATURE_VALUE_NOT_AVAILABLE,
  LAST_WATERED_VALUE_NOT_AVAILABLE,
} from "../../../Consts/OverviewPage/consts";

const OverviewPage = () => {
  const growEnvsStore = useSelector(
    (state) => state.growEnvironmentsState.growEnvData
  );
  console.log("Grow Environments from Store:", growEnvsStore);
  return (
    <Box>
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
          alignItems={"stretch"}
          justifyContent="center"
          sx={{ margin: "0 auto" }}
        >
          {(growEnvsStore || []).map((growEnv) => (
            <Grid
              item
              key={growEnv._id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <GrowEnviromentCard
                id={growEnv._id}
                plantSpecies={growEnv.species}
                plantName={growEnv.growEnvName}
                location={growEnv.growEnvLocation}
                growMedium={growEnv.growMedium}
                humidity={
                  _.last(growEnv.sensorReadingHistory)?.humidity ??
                  HUMIDITY_VALUE_NOT_AVAILABLE
                }
                ph={
                  _.last(growEnv.sensorReadingHistory)?.ph ??
                  PH_VALUE_NOT_AVAILABLE
                }
                ec={
                  _.last(growEnv.sensorReadingHistory)?.ec ??
                  EC_VALUE_NOT_AVAILABLE
                }
                temperature={
                  _.last(growEnv.sensorReadingHistory)?.temperature ??
                  TEMPERATURE_VALUE_NOT_AVAILABLE
                }
                optimalRange={growEnv.optimalRanges}
                lastWatered={
                  _.last(growEnv.sensorReadingHistory)?.currentDateTime ??
                  LAST_WATERED_VALUE_NOT_AVAILABLE
                }
                image={growEnv.imageMetaData?.url}
                imageMetaData={growEnv.imageMetaData}
                createdAt={growEnv.createdAt}
                updatedAt={growEnv.updatedAt}
                sensorReadingHistory={growEnv.sensorReadingHistory}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default OverviewPage;
