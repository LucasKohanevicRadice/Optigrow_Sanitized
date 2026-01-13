import React from "react";
import {
  Typography,
  Grid2,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormHelperText,
} from "@mui/material";

const OptimalRangeSection = ({
  title,
  useCustomRange,
  minDefaultValue,
  maxDefaultValue,
  minCustom,
  maxCustom,
  minError,
  maxError,
  limits,
  handleCustomRangeToggle,
  handleCustomRangeInputChange,
  validateRange,
}) => (
  <>
    <Grid2 container>
      <Grid2
        size={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">{title} Optimal range</Typography>
      </Grid2>
    </Grid2>
    <Grid2 container spacing={2} sx={{ mb: 2 }}>
      {/* CheckBox */}
      <Grid2 size={12} sx={{ display: "flex", justifyContent: "flex-start" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={useCustomRange}
                onChange={(e) => {
                  handleCustomRangeToggle(title, e);
                }}
              />
            }
            label={`Use custom optimal ranges for ${title}`}
          />
        </FormGroup>
      </Grid2>

      {/* Min Value */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth error={minError}>
          <TextField
            label={`Minimum ${title} Value`}
            name="min"
            type="text"
            value={useCustomRange ? minCustom : minDefaultValue}
            onChange={(e) => handleCustomRangeInputChange(e, title)}
            disabled={!useCustomRange}
          />
          <FormHelperText>
            {minError
              ? `Value must be between ${limits?.min} and ${limits?.max} and lower than maximum`
              : ""}
          </FormHelperText>
        </FormControl>
      </Grid2>

      {/* Max Value */}
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth error={maxError}>
          <TextField
            label={`Maximum ${title} Value`}
            type="text"
            name="max"
            value={useCustomRange ? maxCustom : maxDefaultValue}
            onChange={(e) => handleCustomRangeInputChange(e, title)}
            disabled={!useCustomRange}
          />
          <FormHelperText>
            {maxError
              ? `Value must be between ${limits?.min} and ${limits?.max} and greater than minimum`
              : ""}
          </FormHelperText>
        </FormControl>
      </Grid2>
    </Grid2>
  </>
);

export default OptimalRangeSection;
