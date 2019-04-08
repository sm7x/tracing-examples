const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordSchema = new Schema({
  word: String,
  meaning: String,
  synonyms: String,
  usage_note: String,
});

module.exports = mongoose.model('Word', WordSchema);