import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  Button,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { uploadImage } from "../../api/firebaseStorage";

const UploadZone = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  border: `2px dashed ${theme.palette.primary.main}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ImageUploadZone = ({ onFileSelected }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = (file) => {
    setError("");
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      if (onFileSelected) onFileSelected(file);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <Box>
      <UploadZone
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("imageInput").click()}
        sx={{ mb: 2 }}
      >
        {preview ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
            <Typography variant="caption" color="text.secondary">
              {fileName}
            </Typography>
          </Box>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography>
              Drag and drop an image here or click to select
            </Typography>
          </>
        )}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          hidden
          onChange={handleInputChange}
        />
      </UploadZone>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImageUploadZone;
