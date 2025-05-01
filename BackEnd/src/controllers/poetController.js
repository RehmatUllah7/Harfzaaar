import User from "../models/User.js"; // import user model
import Poet from "../models/Poet.js";
import Ghazal from "../models/Ghazal.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const submitPoetDetails = async (req, res) => {
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
      userId,
    } = req.body;

    console.log('Received data:', { poetName, poetryDomain, poetryTitle, genre, userId });

    // Validate required fields
    if (!poetName || !poetryDomain || !poetryTitle || !poetryContent || !genre || !biography || !couplet || !image || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate poetName specifically
    if (typeof poetName !== 'string' || poetName.trim().length === 0) {
      return res.status(400).json({ message: "Invalid poet name" });
    }

    // Validate user exists and is not already a poet
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "poet") {
      return res.status(400).json({ message: "User is already a poet" });
    }

    try {
      // Check if image data is valid
      if (!image.startsWith('data:image/')) {
        throw new Error('Invalid image format');
      }

      // Save base64 image to file
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate unique filename using timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const imageFileName = `poet_${timestamp}_${randomString}.jpg`;
      
      // Create uploads directory in the project root
      const uploadsDir = path.join(process.cwd(), 'uploads');
      console.log('Uploads directory path:', uploadsDir);
      
      if (!fs.existsSync(uploadsDir)) {
        console.log('Creating uploads directory...');
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const imagePath = path.join(uploadsDir, imageFileName);
      console.log('Attempting to save image at:', imagePath);

      // Check if file already exists
      if (fs.existsSync(imagePath)) {
        throw new Error('File already exists');
      }

      fs.writeFileSync(imagePath, buffer);
      console.log('Image saved successfully at:', imagePath);

      // Create ghazal
      const ghazal = new Ghazal({
        poetName,
        poetryDomain,
        poetryTitle,
        poetryContent,
        genre,
      });

      const savedGhazal = await ghazal.save();
      console.log('Ghazal saved successfully:', savedGhazal._id);

      // Check if poet with same name already exists
      const existingPoet = await Poet.findOne({ name: poetName.trim() });
      if (existingPoet) {
        throw new Error('A poet with this name already exists');
      }

      // Create poet with validated name
      const poetData = {
        name: poetName.trim(),
        biography,
        couplet,
        image: `/uploads/${imageFileName}`,
        ghazals: [savedGhazal._id],
      };

      console.log('Attempting to save poet with data:', {
        name: poetData.name,
        biography: poetData.biography ? 'present' : 'missing',
        couplet: poetData.couplet ? 'present' : 'missing',
        image: poetData.image,
        ghazals: poetData.ghazals
      });

      const poet = new Poet(poetData);
      const savedPoet = await poet.save();
      console.log('Poet saved successfully:', savedPoet._id);

      // Update user role
      const updatedUser = await User.findByIdAndUpdate(userId, { role: "poet" });
      console.log('User role updated successfully:', updatedUser._id);

      res.status(200).json({ message: "Poet registered and role updated!" });
    } catch (fileError) {
      console.error('Error saving file:', fileError);
      console.error('Error stack:', fileError.stack);
      
      // Clean up the image file if it was created
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      
      return res.status(500).json({ 
        message: "Error saving image file", 
        error: fileError.message,
        details: fileError.stack 
      });
    }
  } catch (err) {
    console.error('Error in submitPoetDetails:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: "Something went wrong!", 
      error: err.message,
      details: err.stack 
    });
  }
};
