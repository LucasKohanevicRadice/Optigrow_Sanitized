const User = require("../models/users");
const PlantInfo = require("../models/GeneralPlantInfo");
const GrowEnvironment = require("../models/growEnvironments");

exports.createTestGrowEnv = async () => {
  const growEnv = new GrowEnvironment({
    species: "Bombaclat plant",
    growMedium: "Soil",
    growEnvName: "Test enviroment bombaclat dev",
    growEnvLocation: "Living room",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHzKHPPPBt0jXu5YCWCq-Edsr6cDz8zlpXjw&s",
    optimalRanges: {
      ph: { min: 6.5, max: 7.5 },
      ec: { min: 1.5, max: 2.0 },
      humidity: { min: 30, max: 50 },
      temperature: { min: 20, max: 25 },
    },
    currentValues: {
      ph: 7.0,
      ec: 1.8,
      humidity: 40,
      temperature: 22,
      currentDateTime: new Date(),
    },
    sensorReadingHistory: [
      { dateTime: new Date(), ph: 7.0, ec: 1.8, humidity: 40, temperature: 22 },
      {
        dateTime: new Date(Date.now() - 3600000),
        ph: 6.8,
        ec: 1.7,
        humidity: 42,
        temperature: 21,
      },
      {
        dateTime: new Date(Date.now() - 7200000),
        ph: 7.2,
        ec: 1.9,
        humidity: 38,
        temperature: 23,
      },
    ],
  });
  try {
    return await growEnv.save();
  } catch (err) {
    throw err;
  }
};

exports.createTestUser = async () => {
  const user = new User({
    username: "test100",
    email: "asdasd100@asdasd100.fi",
  });
  return user.save();
};

exports.createSamplePlant = async () => {
  const plantInfo = new PlantInfo({
    species: "Bombaclat plant dev",
    growMedium: "Soil",
    optimalRanges: {
      ph: { min: 6.5, max: 7.5 },
      ec: { min: 1.5, max: 2.0 },
      humidity: { min: 30, max: 50 },
    },
    description: "Sample dev plant bombaclat",
  });
  return plantInfo.save();
};
