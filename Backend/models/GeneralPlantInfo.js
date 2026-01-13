const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optimalRangeSchema = new Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  { _id: false }
);

const plantInfoSchema = new Schema(
  {
    species: {
      type: String,
      required: true,
      trim: true,
    },
    preferredGrowMedium: {
      type: String,
      required: true,
      trim: true,
    }, // This field, combined with species, defines the specific context
    optimalRanges: {
      // Contains all optimal ranges for this specific species-growMedium combo
      ph: { type: optimalRangeSchema, required: true },
      ec: { type: optimalRangeSchema, required: true },
      humidity: { type: optimalRangeSchema, required: true },
    },
    description: {
      // Optional: General description of the species
      type: String,
      trim: true,
    },
    imageUrl: {
      // Optional: A general image for the species
      type: String,
      trim: true,
    },
    // Add any other general info about the plant species if needed
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const PlantInfo = mongoose.model("PlantInfo", plantInfoSchema);
module.exports = PlantInfo;
