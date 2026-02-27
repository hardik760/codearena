const Progress = require("../models/Progress");
const client = require("../config/redis");

exports.getProgress = async (req, res) => {
  try {
    const cached = await client.get("progress");

    if (cached) {
      console.log("Serving from Redis cache");
      return res.json(JSON.parse(cached));
    }

    const data = await Progress.find();

    await client.setEx("progress", 60, JSON.stringify(data));

    console.log("Serving from MongoDB");
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};