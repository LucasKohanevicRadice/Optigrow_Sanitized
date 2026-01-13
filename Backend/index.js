const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const env = dotenv.config();
dotenvExpand.expand(env);

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const plantsRoutes = require("./routes/plantsRoutes");
const growEnvRoutes = require("./routes/growEnvRoutes");
const devRoutes = require("./routes/devRoutes");

const PORT = process.env.PORT || 3001;

const clientOptions1 = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const clientOptions2 = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const app = express();
mongoose
  .connect(process.env.MONGODB_ATLAS_ADMIN_URI, clientOptions2)
  .then(async () => {
    console.log("Connected to MongoDB");
    try {
      console.log("Mongoose connection name:", mongoose.connection.name);
      console.log(
        "Mongoose hosts:",
        mongoose.connection.hosts || mongoose.connection.host
      );
    } catch (e) {
      console.warn(
        "Failed to read mongoose connection details:",
        e && e.message ? e.message : e
      );
    }
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.use(cors({ origin: process.env.VITE_FRONTEND_URL }));
app.use(express.json());
app.use(morgan("dev"));

// mount plants routes (controllers in routes/plantsRoutes.js)
app.use("/api/plants", plantsRoutes);
app.use("/api/growEnvs", growEnvRoutes);

if (process.env.NODE_ENV !== "production") {
  app.use("/dev", devRoutes);
}

// Example: simple health check
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// global error handler (should be after routes)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
