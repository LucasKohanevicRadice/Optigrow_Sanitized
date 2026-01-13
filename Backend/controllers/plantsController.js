const plantsService = require("../services/plantsService");

exports.getPlants = async (req, res, next) => {
  try {
    const plants = await plantsService.findAll();
    res.json(plants);
  } catch (err) {
    next(err);
  }
};

exports.getPlantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing id" });
    const plant = await plantsService.findById(id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });
    res.json(plant);
  } catch (err) {
    next(err);
  }
};
