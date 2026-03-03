const User = require("../models/User");
const aggregatorService = require("../services/aggregatorService");
const consistencyCalculator = require("../utils/consistencyCalculator");
const client = require("../config/redis");

exports.getUserAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cacheKey = `analytics:${userId}`;

        // 1. Check Redis Cache First
        if (client.isOpen) {
            try {
                const cachedData = await client.get(cacheKey);
                if (cachedData) {
                    console.log(`Cache hit for user ${userId}`);
                    return res.json(JSON.parse(cachedData));
                }
            } catch (err) {
                console.error("Redis Cache Read Error:", err.message);
            }
        }

        // 2. Fetch Fresh Data (Parallel requests)
        const [github, leetcode, codeforces] = await Promise.all([
            aggregatorService.getGitHubStats(user.githubHandle),
            aggregatorService.getLeetCodeStats(user.leetcodeHandle),
            aggregatorService.getCodeforcesStats(user.codeforcesHandle)
        ]);

        // 3. Process Heatmaps & Consistency Score
        const ghCalendar = github?.calendar || [];
        const lcCalendar = leetcode?.calendar || [];
        const cfCalendar = codeforces?.calendar || [];

        const unifiedHeatmap = consistencyCalculator.mergeHeatmapData(lcCalendar, cfCalendar, ghCalendar);

        // Add dynamic intensity levels (0-4) to heatmap for the frontend UI
        const heatmapWithIntensity = unifiedHeatmap.map(day => ({
            ...day,
            intensity: consistencyCalculator.calculateIntensity(day.total)
        }));

        const consistencyScore = consistencyCalculator.calculateConsistencyScore(unifiedHeatmap);

        // 4. Construct Final Response Payload
        const responseData = {
            github: github ? {
                public_repos: github.public_repos,
                followers: github.followers,
                languages: github.languages
            } : null,
            leetcode: leetcode ? {
                totalSolved: leetcode.totalSolved,
                easySolved: leetcode.easySolved,
                mediumSolved: leetcode.mediumSolved,
                hardSolved: leetcode.hardSolved
            } : null,
            codeforces: codeforces ? {
                rating: codeforces.rating,
                maxRating: codeforces.maxRating,
                rank: codeforces.rank
            } : null,
            unifiedHeatmap: heatmapWithIntensity,
            consistencyScore
        };

        // 5. Update Database Minimal Metadata
        user.cachedStats = {
            totalSolved: leetcode?.totalSolved || 0,
            maxRating: codeforces?.maxRating || 0,
            repoCount: github?.public_repos || 0,
            followers: github?.followers || 0,
            consistencyScore
        };
        user.lastSyncedAt = new Date();
        await user.save();

        // 6. Save back to Redis (Cache for 1 Hour)
        if (client.isOpen) {
            try {
                // 3600 seconds = 1 hour TTL
                await client.setEx(cacheKey, 3600, JSON.stringify(responseData));
            } catch (err) {
                console.error("Redis Cache Write Error:", err.message);
            }
        }

        res.json(responseData);
    } catch (err) {
        console.error("Analytics Error:", err.message);
        res.status(500).json({ error: "Failed to fetch analytics data" });
    }
};

exports.updateProfileHandles = async (req, res) => {
    try {
        const { githubHandle, leetcodeHandle, codeforcesHandle, bio } = req.body;

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { githubHandle, leetcodeHandle, codeforcesHandle, bio },
            { new: true }
        );

        // Invalidate cache since handles changed
        if (client.isOpen) {
            try {
                await client.del(`analytics:${req.user.id}`);
            } catch (err) {
                console.error("Redis Cache Del Error:", err.message);
            }
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
