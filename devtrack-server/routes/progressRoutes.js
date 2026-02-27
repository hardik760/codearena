const express = require("express");
const router = express.Router();
const auth = require("./middleware/authMiddleware");
const { getProgress } = require("../controllers/progressController");

router.get("/", auth, getProgress);

module.exports = router;