import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: String, required: true },
    image: { type: String, required: false }, // Store the image file path or filename
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);
export default News;
