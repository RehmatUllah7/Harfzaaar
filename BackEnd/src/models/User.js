import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';  // Default import
const { genSalt, hash, compare } = bcrypt;  // Destructure the methods from bcrypt
import mongoose from "mongoose"; // ✅ Import mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    code: { type: String },
    expiry: { type: Date },
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poetry" }], // Store poetry IDs
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model('User', userSchema);

export default User;
