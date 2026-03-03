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

    if (client.isOpen) {
      try {
        const cached = await client.get(key);
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (cacheErr) {
        console.error("Redis Get Error:", cacheErr.message);
      }
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

    if (client.isOpen) {
      try {
        await client.setEx(key, 60, JSON.stringify(response));
      } catch (cacheErr) {
        console.error("Redis Set Error:", cacheErr.message);
      }
    }

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
    if (client.isOpen) {
      try {
        const key = `progress:${req.user.id}`;
        await client.del(key);
      } catch (cacheErr) {
        console.error("Redis Del Error:", cacheErr.message);
      }
    }

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