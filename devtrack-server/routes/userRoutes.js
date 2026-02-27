const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

router.post(
  "/upload-profile",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.filename },
      { new: true }
    );

    res.json(user);
  }
);

module.exports = router;