const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  githubHandle: { type: String, default: "" },
  leetcodeHandle: { type: String, default: "" },
  codeforcesHandle: { type: String, default: "" },
  bio: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  profileImage: String,
  lastSyncedAt: { type: Date, default: null },
  cachedStats: {
    totalSolved: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    repoCount: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model("User", userSchema);