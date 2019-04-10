const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordSchema = new Schema({
  word: String,
  pos: String,
  meaning: String,
  synonyms: String,
  usageNote: String,
});

module.exports = mongoose.model('Word', WordSchema);