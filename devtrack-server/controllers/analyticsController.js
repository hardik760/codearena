const Analytics = require("../models/Analytics");
const aggregatorService = require("../services/aggregatorService");

exports.getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await require("../models/User").findById(userId);

        let analytics = await Analytics.findOne({ userId });

        // Simple 1-hour cache check
        const now = new Date();
        const isStale = !analytics || (now - analytics.updatedAt) > 3600000;

        if (isStale) {
            const [github, leetcode, codeforces] = await Promise.all([
                aggregatorService.getGitHubStats(user.githubHandle),
                aggregatorService.getLeetCodeStats(user.leetcodeHandle),
                aggregatorService.getCodeforcesStats(user.codeforcesHandle)
            ]);

            if (!analytics) {
                analytics = new Analytics({ userId });
            }

            analytics.github = { stats: github, lastUpdate: now };
            analytics.leetcode = { stats: leetcode, lastUpdate: now };
            analytics.codeforces = { stats: codeforces, lastUpdate: now };
            analytics.updatedAt = now;

            // Basic Consistency Score calculation (can be refined)
            let score = 0;
            if (github) score += 30;
            if (leetcode?.totalSolved > 100) score += 40;
            if (codeforces?.rating > 1200) score += 30;
            analytics.consistencyScore = score;

            await analytics.save();
        }

        res.json(analytics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfileHandles = async (req, res) => {
    try {
        const { githubHandle, leetcodeHandle, codeforcesHandle, bio } = req.body;
        const user = await require("../models/User").findByIdAndUpdate(
            req.user.id,
            { githubHandle, leetcodeHandle, codeforcesHandle, bio },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
