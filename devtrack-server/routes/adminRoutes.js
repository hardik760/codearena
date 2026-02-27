const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.get("/dashboard", auth, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;