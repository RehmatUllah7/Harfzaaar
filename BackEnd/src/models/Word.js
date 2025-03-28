// backend/models/Word.js
import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  ravi1: { type: String, required: true },
  ravi2: { type: String, required: true },
  ravi3: { type: String, required: true },
  ravi4: { type: String, required: true },
  ravi5: { type: String, required: true },
});

const Word = mongoose.model('Word', wordSchema ,"qaafia_words");
export default Word;