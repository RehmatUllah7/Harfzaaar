import PendingPoet from '../models/PendingPoet.js';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

export const becomePoet = async (req, res) => {
  try {
    const {
      poetName,
      poetryDomain,
      poetryTitle,
      poetryContent,
      genre,
      biography,
      couplet,
      image,
      userId
    } = req.body;

    if (!poetName || !poetryDomain || !poetryTitle || !poetryContent || !genre || !biography || !couplet || !image || !userId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.v2.uploader.upload(image, {
      folder: 'harfzaar/poets'
    });

    // Save to MongoDB
    const newPoet = new PendingPoet({
      poetName,
      poetryDomain,
      poetryTitle,
      poetryContent,
      genre,
      biography,
      couplet,
      image: uploadedImage.secure_url,
      userId
    });

    await newPoet.save();

    res.status(201).json({ message: 'Submission successful and under review.' });
  } catch (error) {
    console.error('Error submitting poet:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
