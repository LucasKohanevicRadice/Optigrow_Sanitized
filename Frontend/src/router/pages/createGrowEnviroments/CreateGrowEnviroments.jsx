import { useDispatch, useSelector } from "react-redux";
import { useCreateGrowEnv } from "../../../hooks/useGrowEnvs";
import { useEffect, useState } from "react";
import { useFetchPlants } from "../../../hooks/usePlants";
import {
  Typography,
  Grid2,
  Box,
  Link,
  Paper,
  Container,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import ImageUploadZone from "../../../components/ImageUploadZone/ImageUploadZone";
import { uploadImage } from "../../../api/firebaseStorage";
import OptimalRangeSection from "./Components/OptimalRangeSection/OptimalRangeSection";
import SuccessAlert from "./Components/SubmitPopUpAlerts/SuccessAlert";
import ErrorAlert from "./Components/SubmitPopUpAlerts/ErrorAlert";
import { realLifeLimits } from "../../../db/mockGrowEnviroments";
import mockGrowEnvironments from "../../../db/mockGrowEnviroments.js";
import {
  COCO_COIR_LABEL,
  SOIL_LABEL,
  HYDROPONICS_LABEL,
  PH_LABEL,
  EC_LABEL,
  HUMIDITY_LABEL,
  MIN_LABEL,
  MAX_LABEL,
  GROW_ENV_FIELD_NAME,
  GROW_ENV_FIELD_LABEL_PLACEHOLDER,
  GROW_ENV_FIELD_LOCATION_NAME,
  GROW_ENV_FIELD_LOCATION_LABEL_PLACEHOLDER,
  CHOOSE_GROW_MEDIUM_PLACEHOLDER,
  CHOOSE_PLANT_SPECIES_PLACEHOLDER,
  DASH,
} from "../../../Consts/CreateGrowEnviroments/consts";

const growMediums = [
  {
    label: COCO_COIR_LABEL,
    id: 1,
  },
  {
    label: SOIL_LABEL,
    id: 2,
  },
  {
    label: HYDROPONICS_LABEL,
    id: 3,
  },
];

const CreateGrowEnviroments = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { ph, ec, humidity } = realLifeLimits;
  const { data: plantInfos, isLoading, error } = useFetchPlants();
  const { mutate: createGrowEnv } = useCreateGrowEnv();
  const [isCreating, setIsCreating] = useState(false);
  const mockGrowEnvironment = mockGrowEnvironments[0]; // FOR USING PLACEHOLDER VALUES

  useEffect(() => {
    const plantSpecies = plantInfos
      ? plantInfos.map((plant) => ({
          label: plant.species,
          id: plant._id,
          optimalRanges: plant.optimalRanges,
        }))
      : [];

    setPlantsInfoState(plantSpecies);
    if (isLoading) console.log("Loading plants...");
    if (error) console.error("Plants fetch error:", error);
    if (plantInfos) console.log("DB plants:", plantInfos);
    if (plantSpecies) console.log("Plant species:", plantSpecies);
  }, [plantInfos, isLoading, error]);

  // Stores immutable array of plant species for Autocomplete options
  const [plantsInfoState, setPlantsInfoState] = useState();

  // State for form inputs other than optimal ranges
  const [formState, setFormState] = useState({
    species: "",
    growMedium: "",
    growEnvName: "",
    growEnvLocation: "",
  });

  // State for selected image file
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);

  const [submitAlertState, setSubmitAlertState] = useState({
    successOpen: false,
    errorOpen: false,
  });

  // State for optimal range inputs
  const [phInputState, setPhInputState] = useState({
    useCustom: false, // Custom optimal range disabled by default
    min: ph.min, // minimum value set to minimum value from real life limits by default
    max: ph.max, // maximum value set to maximum value from real life limits by default
    minError: false,
    maxError: false,
  });
  const [ecInputState, setEcInputState] = useState({
    useCustom: false, // Custom optimal range disabled by default
    min: ec.min, // minimum value set to minimum value from real life limits by default
    max: ec.max, // maximum value set to maximum value from real life limits by default
    minError: false,
    maxError: false,
  });
  const [humidityInputState, setHumidityInputState] = useState({
    useCustom: false, // Custom optimal range disabled by default
    min: humidity.min, // minimum value set to minimum value from real life limits by default
    max: humidity.max, // maximum value set to maximum value from real life limits by default
    minError: false,
    maxError: false,
  });

  // Handler for when image file is selected
  const handleImageFileSelected = (file) => {
    setSelectedImageFile(file);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Compares current value with default real life limit optimal range values
  const handleCustomRangeInputChange = (e, title) => {
    const { name, value } = e.target;

    const validateNumericOrEmpty = (val) => {
      // Checks if the value is empty or a valid number for numerical inputs of optimal values
      return val === "" || /^-?\d*\.?\d*$/.test(val);
    };

    if (validateNumericOrEmpty(value)) {
      switch (title) {
        case PH_LABEL:
          setPhInputState((prev) => ({ ...prev, [name]: value }));
          if (name === MIN_LABEL) {
            validatePh(value, phInputState.max);
          } else {
            validatePh(phInputState.min, value);
          }
          break;
        case EC_LABEL:
          setEcInputState((prev) => ({ ...prev, [name]: value }));
          if (name === MIN_LABEL) {
            validateEc(value, ecInputState.max);
          } else {
            validateEc(ecInputState.min, value);
          }
          break;
        case HUMIDITY_LABEL:
          setHumidityInputState((prev) => ({ ...prev, [name]: value }));
          if (name === MIN_LABEL) {
            validateHumidity(value, humidityInputState.max);
          } else {
            validateHumidity(humidityInputState.min, value);
          }
          break;
        default:
          console.warn(`Unknown range type: ${title}`);
      }
    }
  };

  const handleCustomRangeToggle = (title, e) => {
    const isChecked = e.target.checked;
    switch (title) {
      case PH_LABEL:
        // Update phInputState with functional state updates
        setPhInputState((prev) => ({
          ...prev,
          useCustom: isChecked,
          min: isChecked ? prev.min : ph.min,
          max: isChecked ? prev.max : ph.max,
          minError: isChecked ? prev.minError : false,
          maxError: isChecked ? prev.maxError : false,
        }));

        // Reset min/max values when unchecking
        if (isChecked) {
          validatePh();
        }
        break;
      case EC_LABEL:
        // Update ecInputState with functional state updates
        setEcInputState((prev) => ({
          ...prev,
          useCustom: isChecked,
          min: isChecked ? prev.min : ec.min,
          max: isChecked ? prev.max : ec.max,
          minError: isChecked ? prev.minError : false,
          maxError: isChecked ? prev.maxError : false,
        }));

        // Reset min/max values when unchecking
        if (isChecked) {
          validateEc();
        }
        break;
      case HUMIDITY_LABEL:
        // Update ecInputState with functional state updates
        setHumidityInputState((prev) => ({
          ...prev,
          useCustom: isChecked,
          min: isChecked ? prev.min : humidity.min,
          max: isChecked ? prev.max : humidity.max,
          minError: isChecked ? prev.minError : false,
          maxError: isChecked ? prev.maxError : false,
        }));

        // Reset min/max values when unchecking
        if (isChecked) {
          validateHumidity();
        }
        break;
      default:
        console.warn(`Unknown range type: ${title}`);
    }
  };

  // Input Validation functions for optimal ranges
  // Generic validation function for all range types

  const validateRange = (
    minDefaultValue,
    maxDefaultValue,
    limits,
    setMinError,
    setMaxError,
    useCustomRange
  ) => {
    const minValue = Number(minDefaultValue);
    const maxValue = Number(maxDefaultValue);

    if (!useCustomRange) {
      setMinError(false);
      setMaxError(false);
      return true;
    }

    const minError =
      minValue < limits.min || minValue > limits.max || minValue >= maxValue;
    const maxError =
      maxValue < limits.min || maxValue > limits.max || maxValue <= minValue;

    setMinError(minError);
    setMaxError(maxError);

    return !(minError || maxError);
  };

  const validatePh = (min = phInputState.min, max = phInputState.max) => {
    return validateRange(
      min,
      max,
      ph,
      (error) => setPhInputState((prev) => ({ ...prev, minError: error })),
      (error) => setPhInputState((prev) => ({ ...prev, maxError: error })),
      phInputState.useCustom
    );
  };

  const validateEc = (min = ecInputState.min, max = ecInputState.max) => {
    return validateRange(
      min,
      max,
      ec,
      (error) => setEcInputState((prev) => ({ ...prev, minError: error })),
      (error) => setEcInputState((prev) => ({ ...prev, maxError: error })),
      ecInputState.useCustom
    );
  };

  const validateHumidity = (
    min = humidityInputState.min,
    max = humidityInputState.max
  ) => {
    return validateRange(
      min,
      max,
      humidity,
      (error) =>
        setHumidityInputState((prev) => ({ ...prev, minError: error })),
      (error) =>
        setHumidityInputState((prev) => ({ ...prev, maxError: error })),
      humidityInputState.useCustom
    );
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    let imageMetaToSend = null;
    if (selectedImageFile) {
      try {
        const { url, path } = await uploadImage(selectedImageFile);
        imageMetaToSend = {
          url,
          storagePath: path,
          originalFileName: selectedImageFile.name,
          size: selectedImageFile.size,
          contentType: selectedImageFile.type,
          uploadedAt: new Date().toISOString(),
        };
      } catch (err) {
        setSubmitAlertState((prevState) => ({ ...prevState, errorOpen: true }));
        console.error("Image upload failed:", err);
        return;
      }
    }

    // Consolidate all form data
    const formDataToSubmit = {
      ...formState,
      optimalRanges: {
        ph: {
          min: Number(phInputState.min),
          max: Number(phInputState.max),
        },
        ec: {
          min: Number(ecInputState.min),
          max: Number(ecInputState.max),
        },
        humidity: {
          min: Number(humidityInputState.min),
          max: Number(humidityInputState.max),
        },
      },
      imageMetaData: imageMetaToSend,
      sensorReadingHistory: mockGrowEnvironment.sensorReadingHistory || [], // PLACEHOLDER MOCK ARRAY UNTIL SENSOR INTEGRATION IS DONE
    };

    createGrowEnv(formDataToSubmit, {
      onSuccess: () => {
        // Reset form state
        setFormState({
          species: "",
          growMedium: "",
          growEnvName: "",
          growEnvLocation: "",
        });
        setSelectedImageFile(null);
        setImageMeta(null);
        setPhInputState({
          useCustom: false,
          min: ph.min,
          max: ph.max,
          minError: false,
          maxError: false,
        });
        setEcInputState({
          useCustom: false,
          min: ec.min,
          max: ec.max,
          minError: false,
          maxError: false,
        });
        setHumidityInputState({
          useCustom: false,
          min: humidity.min,
          max: humidity.max,
          minError: false,
          maxError: false,
        });
        setSubmitAlertState((prevState) => ({
          ...prevState,
          successOpen: true,
        }));
        setIsCreating(false);
      },
      onError: (error) => {
        setSubmitAlertState((prevState) => ({
          ...prevState,
          errorOpen: true,
        }));
        setIsCreating(false);
        console.error("Failed to create grow environment:", error);
      },
    });
  };
  return (
    <>
      <Box component={"form"} onSubmit={handleSubmit}>
        <Container maxWidth="xl">
          {/* Add BasicForm at the top
          <BasicForm /> */}
          {/* PAPER ELEVATION AND TITLE FOR PAGE */}
          <Paper sx={{ p: 3 }} elevation={2}>
            <Grid2 container spacing={2} sx={{ mb: 2 }}>
              <Grid2
                size={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center" /* Center the title */,
                }}
              >
                <Typography variant="h4">
                  Create a new grow enviroment
                </Typography>
              </Grid2>
            </Grid2>
            {/* FORM INPUTS */}
            <Grid2
              container
              spacing={2}
              sx={{
                display: "flex",
                justifyContent:
                  "space-between" /* Evenly space the form fields */,
                alignItems: "center",
                mb: 2,
              }}
            >
              <Grid2
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{
                  display: "flex",
                  justifyContent: "center" /* Center each form field */,
                }}
              >
                <FormControl sx={{ width: "100%" }}>
                  <Autocomplete
                    autoHighlight
                    disablePortal
                    fullWidth
                    options={plantsInfoState}
                    value={formState.species}
                    onChange={(event, newValue) => {
                      setFormState((prev) => ({
                        ...prev,
                        species: newValue?.label || "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={CHOOSE_PLANT_SPECIES_PLACEHOLDER}
                      />
                    )}
                  />
                </FormControl>
              </Grid2>
              <Grid2
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{
                  display: "flex",
                  justifyContent: "center" /* Center each form field */,
                }}
              >
                <FormControl sx={{ width: "100%" }}>
                  <Autocomplete
                    autoHighlight
                    disablePortal
                    fullWidth
                    options={growMediums}
                    value={formState.growMedium}
                    onChange={(event, newValue) => {
                      setFormState((prev) => ({
                        ...prev,
                        growMedium: newValue?.label || "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={CHOOSE_GROW_MEDIUM_PLACEHOLDER}
                      />
                    )}
                  />
                </FormControl>
              </Grid2>
              <Grid2
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{
                  display: "flex",
                  justifyContent: "center" /* Center each form field */,
                }}
              >
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label={GROW_ENV_FIELD_LABEL_PLACEHOLDER}
                    name={GROW_ENV_FIELD_NAME}
                    variant="outlined"
                    value={formState.growEnvName}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid2>
              <Grid2
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{
                  display: "flex",
                  justifyContent: "center" /* Center each form field */,
                }}
              >
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    variant="outlined"
                    name={GROW_ENV_FIELD_LOCATION_NAME}
                    label={GROW_ENV_FIELD_LOCATION_LABEL_PLACEHOLDER}
                    value={formState.growEnvLocation}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid2>
            </Grid2>
            {/*  */}
            {/* PLANT ENVIROMENT OPTIMAL RANGES */}
            {/*  */}
            {/* pH OPTIMAL RANGE INPUTS */}
            <OptimalRangeSection
              title={PH_LABEL}
              useCustomRange={phInputState.useCustom}
              minDefaultValue={
                formState.species
                  ? plantsInfoState.find(
                      (plant) => plant.label === formState.species
                    )?.optimalRanges.ph.min
                  : DASH
              }
              maxDefaultValue={
                formState.species
                  ? plantsInfoState.find(
                      (plant) => plant.label === formState.species
                    )?.optimalRanges.ph.max
                  : DASH
              }
              minCustom={phInputState.min}
              maxCustom={phInputState.max}
              minError={phInputState.minError}
              maxError={phInputState.maxError}
              limits={ph}
              handleCustomRangeToggle={handleCustomRangeToggle}
              handleCustomRangeInputChange={handleCustomRangeInputChange}
            />
            {/*  */}
            {/* EC OPTIMAL RANGE SECTION */}
            {/*  */}
            <OptimalRangeSection
              title={EC_LABEL}
              useCustomRange={ecInputState.useCustom}
              minDefaultValue={
                formState.species
                  ? plantsInfoState.find(
                      (plant) => plant.label === formState.species
                    )?.optimalRanges.ec.min
                  : DASH
              }
              maxDefaultValue={
                formState.species
                  ? plantsInfoState.find(
                      (plant) => plant.label === formState.species
                    )?.optimalRanges.ec.max
                  : DASH
              }
              minCustom={ecInputState.min}
              maxCustom={ecInputState.max}
              minError={ecInputState.minError}
              maxError={ecInputState.maxError}
              limits={ec}
              handleCustomRangeToggle={handleCustomRangeToggle}
              handleCustomRangeInputChange={handleCustomRangeInputChange}
            />
            {/*  */}
            {/* HUMIDITY OPTIMAL RANGE SECTION */}
            {/*  */}
            <OptimalRangeSection
              title={HUMIDITY_LABEL}
              useCustomRange={humidityInputState.useCustom}
              minDefaultValue={
                formState.species
                  ? plantsInfoState.find(
                      (plant) => plant.label === formState.species
                    )?.optimalRanges.humidity.min
                  : DASH
              }
              maxDefaultValue={
                formState.species
                  ? plantsInfoState.find(
                      (plant) => plant.label === formState.species
                    )?.optimalRanges.humidity.max
                  : DASH
              }
              minCustom={humidityInputState.min}
              maxCustom={humidityInputState.max}
              minError={humidityInputState.minError}
              maxError={humidityInputState.maxError}
              limits={humidity}
              handleCustomRangeToggle={handleCustomRangeToggle}
              handleCustomRangeInputChange={handleCustomRangeInputChange}
            />
            {/* CREATE BUTTON AND IMAGE UPLOAD */}
            <Grid2 container spacing={2}>
              <Grid2
                size={{ xs: 12, sm: 6 }} // Full width on mobile, half on tablet and up
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isCreating ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    startIcon={<Add />}
                    variant="contained"
                    size="large"
                  >
                    Create
                  </Button>
                )}
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                {" "}
                <ImageUploadZone onFileSelected={handleImageFileSelected} />
              </Grid2>
            </Grid2>
            <SuccessAlert
              open={submitAlertState.successOpen}
              onClose={() =>
                setSubmitAlertState({ ...submitAlertState, successOpen: false })
              }
            />
            <ErrorAlert
              open={submitAlertState.errorOpen}
              onClose={() =>
                setSubmitAlertState({ ...submitAlertState, errorOpen: false })
              }
            />
          </Paper>
        </Container>
      </Box>
    </>
  );
};
export default CreateGrowEnviroments;
