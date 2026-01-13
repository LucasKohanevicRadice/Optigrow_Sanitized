const express = require("express");
const router = express.Router();
const devController = require("../controllers/devController.js");

router.get("/register-user", devController.registerUser);
router.get("/plants/register-general-info", devController.registerPlant);
router.get(
  "/grow-envs/register-grow-environment",
  devController.registerGrowEnv
);

module.exports = router;
