const devService = require("../services/devService");

exports.registerUser = async (req, res, next) => {
  try {
    const mongoRes = await devService.createTestUser();
    console.log("Dev: created user", mongoRes._id);
    res.status(201).json(mongoRes);
  } catch (err) {
    next(err);
  }
};

exports.registerPlant = async (req, res, next) => {
  try {
    const mongoRes = await devService.createSamplePlant();
    console.log(
      "Dev: created plant",
      mongoRes._id,
      "species:",
      mongoRes.species
    );
    res.status(201).json(mongoRes);
  } catch (err) {
    next(err);
  }
};

exports.registerGrowEnv = async (req, res, next) => {
  try {
    const mongoRes = await devService.createTestGrowEnv();
    console.log(
      "Dev: created growEnv",
      mongoRes._id,
      "name:",
      mongoRes.growEnvName
    );
    res.status(201).json(mongoRes);
  } catch (err) {
    next(err);
  }
};
