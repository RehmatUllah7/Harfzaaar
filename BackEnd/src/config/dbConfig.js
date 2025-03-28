// backend/config/dbConfig.js
import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    // Remove useNewUrlParser and useUnifiedTopology options
    await connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;  
