const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    github: {
        stats: Object,
        lastUpdate: Date
    },
    leetcode: {
        stats: Object,
        lastUpdate: Date
    },
    codeforces: {
        stats: Object,
        lastUpdate: Date
    },
    consistencyScore: { type: Number, default: 0 },
    heatmaps: {
        unified: [Object], // { date, count }
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Analytics", analyticsSchema);
