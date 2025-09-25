import mongoose from "mongoose";

// Define the schema for user accounts
const userSchema = new mongoose.Schema({
  // Username: must be unique, trimmed, and required
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Email: unique, required, always stored lowercase and trimmed
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Password: required (should be hashed before saving)
  password: {
    type: String,
    required: true
  },
  // User role: either "client" or "admin", defaults to "client"
  role: {
    type: String,
    enum: ["client", "admin"],
    required: true,
    default: "client"
  },
  // Timestamp for when the user was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the User model for use throughout the app
const User = mongoose.model("User", userSchema);
export default User;