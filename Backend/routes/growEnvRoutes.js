const express = require("express");
const router = express.Router();
const growEnvController = require("../controllers/growEnvController.js");

router.get("/", growEnvController.getGrowEnvs);
router.get("/:id", growEnvController.getGrowEnvById);
router.post("/", growEnvController.createGrowEnv);
router.delete("/:id", growEnvController.deleteGrowEnv);
module.exports = router;
