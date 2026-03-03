const Progress = require("../models/Progress");
const client = require("../config/redis");

exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const filter = {
      user: userId,
      platform: { $regex: search, $options: "i" }
    };

    const key = `progress:${userId}:page:${page}:search:${search}`;

    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const data = await Progress.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Progress.countDocuments(filter);

    const response = {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    await client.setEx(key, 60, JSON.stringify(response));

    res.json(response);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createProgress = async (req, res) => {
  try {
    const progress = await Progress.create({
      user: req.user.id,
      platform: req.body.platform,
      solved: req.body.solved
    });

    // Clear cache
    const key = `progress:${req.user.id}`;
    await client.del(key);

    // 🔥 Emit real-time update
    req.io.emit("progress-updated", progress);

    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    await Progress.findByIdAndDelete(req.params.id);

    const key = `progress:${req.user.id}`;
    await client.del(key);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};