const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optimalRangeSchema = new Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  { _id: false }
);

const growEnvSchema = new Schema(
  {
    species: { type: String, required: true, trim: true },
    growMedium: { type: String, required: true, trim: true },
    growEnvName: { type: String, required: true, trim: true, unique: true },
    growEnvLocation: { type: String, trim: true },
    imageMetaData: {
      url: { type: String }, // Firebase Storage download URL
      storagePath: { type: String }, // Firebase Storage path
      originalFileName: { type: String }, // Original file name
      size: { type: Number }, // File size in bytes
      contentType: { type: String }, // MIME type
      uploadedAt: { type: Date }, // Upload timestamp
    },
    optimalRanges: {
      ph: optimalRangeSchema,
      ec: optimalRangeSchema,
      humidity: optimalRangeSchema,
      temperature: optimalRangeSchema,
    },
    currentValues: {
      ph: { type: Number },
      ec: { type: Number },
      humidity: { type: Number },
      temperature: { type: Number },
      currentDateTime: { type: Date, default: Date.now },
    },
    sensorReadingHistory: [
      {
        dateTime: { type: Date, default: Date.now },
        ph: { type: Number },
        ec: { type: Number },
        humidity: { type: Number },
        temperature: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const GrowEnvironment = mongoose.model("GrowEnviroment", growEnvSchema);
module.exports = GrowEnvironment;
