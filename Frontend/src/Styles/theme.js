import { createTheme } from "@mui/material/styles"
import { lightGreen } from "@mui/material/colors"

const theme = createTheme({
  palette: {
    primary: {
      main: "#388e3c",
    },
    secondary: {
      main: lightGreen[500],
    },
  },
})

export default theme
