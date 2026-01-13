const PlantInfo = require("../models/GeneralPlantInfo");

exports.findAll = () => PlantInfo.find().lean();
exports.findById = (id) => PlantInfo.findById(id).lean();
