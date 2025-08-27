    const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  meaning: { type: String, required: true },
  synonyms: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Word', wordSchema);
