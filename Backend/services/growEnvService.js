const GrowEnvironment = require("../models/growEnvironments");

exports.findAll = () => GrowEnvironment.find().lean();
exports.findById = (id) => GrowEnvironment.findById(id).lean();
exports.create = async (data) => {
  const created = await GrowEnvironment.create(data);
  return created.toObject();
};

exports.deleteById = async (id) => {
  const deleted = await GrowEnvironment.findByIdAndDelete(id);
  return deleted ? deleted.toObject() : null;
};
