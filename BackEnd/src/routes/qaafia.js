// backend/routes/qaafia.js
import { Router } from 'express';
import Word from '../models/Word.js';

const router = Router();

// API Endpoint to find matching Qaafia words
router.get('/search', async (req, res) => {
  const { raviPattern } = req.query;

  
  // Log the received raviPattern
  console.log('Received raviPattern:', raviPattern);
  if (!raviPattern) {
    return res.status(400).json({ error: 'Enter the Ravi Pattern' });
  }
 // Decode the raviPattern
 const decodedRaviPattern = decodeURIComponent(raviPattern);
 console.log('Decoded raviPattern:', decodedRaviPattern);
  // Determine pattern length
  const patternLength = raviPattern.length;
  let columnToSearch = '';

  if (patternLength === 1) {
    columnToSearch = 'ravi1';
  } else if (patternLength === 2) {
    columnToSearch = 'ravi2';
  } else if (patternLength === 3) {
    columnToSearch = 'ravi3';
  } else if (patternLength === 4) {
    columnToSearch = 'ravi4';
  } else if (patternLength === 5) {
    columnToSearch = 'ravi5';
  } else {
    return res.status(400).json({ error: 'Your Ravi Pattern is too large to be used' });
  }
// Log the column being searched
console.log('Searching column:', columnToSearch);
  try {
     // Query MongoDB for matching words (case-insensitive)
     const query = {
        [columnToSearch]: { $regex: new RegExp(`^${decodedRaviPattern}`, 'i') },
      };
      const totalDocuments = await Word.countDocuments();
      console.log('Total Documents:', totalDocuments);
    // Query MongoDB for matching words
    const matchedWords = await Word.find({ [columnToSearch]: decodedRaviPattern }).select('word -_id');
    

    if (matchedWords.length === 0) {
      return res.status(404).json({ message: 'Sorry, we dont have any qaafia right now which contains your pattern' });
    }
    console.log('Total matched words:', matchedWords.length);
    
    const uniqueMatchedWords = Array.from(new Map(matchedWords.map(word => [word.word, word])).values());

    // Return only words, not full objects
    res.json(uniqueMatchedWords.slice(0, 9).map((word) => word.word));
    console.log("FastText Rated Words", matchedWords.slice(0, 9));
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Server Not Responding' });
  }
});

export default router;