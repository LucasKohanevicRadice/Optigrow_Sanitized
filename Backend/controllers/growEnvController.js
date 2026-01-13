const growEnvService = require("../services/growEnvService");

exports.getGrowEnvs = async (req, res, next) => {
  try {
    const growEnvs = await growEnvService.findAll();
    res.status(200).json(growEnvs);
  } catch (error) {
    next(error);
  }
};

exports.getGrowEnvById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing id" });
    const growEnv = await growEnvService.findById(id);
    if (!growEnv)
      return res.status(404).json({ error: "Grow environment not found" });
    res.status(200).json(growEnv);
  } catch (error) {
    next(error);
  }
};

exports.createGrowEnv = async (req, res, next) => {
  try {
    const payload = req.body;
    const created = await growEnvService.create(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

exports.deleteGrowEnv = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing id" });
    const deleted = await growEnvService.deleteById(id);
    if (!deleted)
      return res.status(404).json({ error: "Grow environment not found" });
    res.status(200).json({ message: "Grow environment deleted", deleted });
  } catch (error) {
    next(error);
  }
};
