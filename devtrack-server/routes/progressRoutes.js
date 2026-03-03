const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const progressController = require("../controllers/progressControllers");

router.get("/", auth, progressController.getProgress);
router.post("/", auth, progressController.createProgress);
router.delete("/:id", auth, progressController.deleteProgress);

module.exports = router;