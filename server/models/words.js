const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true
    },
    meaning: {
      type: String,
      required: true,
      trim: true
    },
    synonyms: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Word", wordSchema);
