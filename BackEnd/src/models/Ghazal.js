import mongoose from "mongoose";

const ghazalSchema = new mongoose.Schema({
  poetName: { type: String, required: true },
  poetryDomain: { type: String, required: true },
  poetryTitle: { type: String, required: true },
  poetryContent: { type: String, required: true },
  genre: { type: String, required: true }
});

export default mongoose.model("Ghazal", ghazalSchema);
