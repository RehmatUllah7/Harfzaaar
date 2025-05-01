import mongoose from "mongoose";

const poetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  biography: {
    type: String,
    required: true
  },
  couplet: {
    type: String,
    required: true
  },
  ghazals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ghazal"
    }
  ]
}, {
  timestamps: true
});

// Drop existing indexes and create new ones
poetSchema.index({ name: 1 }, { 
  unique: true,
  name: 'name_unique_index'
});

const Poet = mongoose.model("Poet", poetSchema);

// Drop existing indexes if they exist
Poet.collection.dropIndexes().catch(err => {
  if (err.code !== 26) { // Ignore error if collection doesn't exist
    console.error('Error dropping indexes:', err);
  }
});

export default Poet;
