import React from "react";
import Alert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";
import Stack from "@mui/material/Stack";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Optionally log error details
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {this.state.error?.message || "Something went wrong."}
          </Alert>
        </Stack>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
