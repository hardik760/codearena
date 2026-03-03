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
});

module.exports = mongoose.model("User", userSchema);