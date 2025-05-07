import mongoose from 'mongoose';

const pendingPoetSchema = new mongoose.Schema({
  poetName: { type: String, required: true },
  poetryDomain: { type: String, required: true },
  poetryTitle: { type: String, required: true },
  poetryContent: { type: String, required: true },
  genre: { type: String, required: true },
  biography: { type: String, required: true },
  couplet: { type: String, required: true },
  image: { type: String, required: true }, // Public URL from Cloudinary
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const PendingPoet = mongoose.model('PendingPoet', pendingPoetSchema);
export default PendingPoet;
