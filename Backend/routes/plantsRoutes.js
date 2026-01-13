const express = require("express");
const router = express.Router();

const plantsController = require("../controllers/plantsController");

router.get("/", plantsController.getPlants);
router.get("/:id", plantsController.getPlantById);

module.exports = router;
