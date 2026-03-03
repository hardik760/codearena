const axios = require("axios");

/**
 * Service to fetch statistics from various coding platforms
 */
class AggregatorService {
    /**
     * Fetch GitHub stats using public API
     */
    async getGitHubStats(username) {
        if (!username) return null;
        try {
            const headers = process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};
            const timeout = 5000;

            // Basic User Info
            const res = await axios.get(`https://api.github.com/users/${username}`, { headers, timeout });

            // Public Repos to extract language
            const repos = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers, timeout });
            const languages = {};
            repos.data.forEach(repo => {
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });

            // Activity Heatmap (Using GitHub Event API as a fallback if no token, 
            // but accurate heatmap requires scraping or GraphQL. We'll simulate 90 days of events for the fallback)
            let calendarMap = [];
            try {
                const events = await axios.get(`https://api.github.com/users/${username}/events`, { headers, timeout });
                const recentMap = {};
                events.data.forEach(event => {
                    const dateStr = event.created_at.split('T')[0];
                    recentMap[dateStr] = (recentMap[dateStr] || 0) + 1;
                });
                calendarMap = Object.entries(recentMap).map(([date, count]) => ({ date, count }));
            } catch (e) {
                console.error("GitHub events fetch failed", e.message);
            }

            return {
                public_repos: res.data.public_repos,
                followers: res.data.followers,
                following: res.data.following,
                created_at: res.data.created_at,
                calendar: calendarMap,
                languages: Object.entries(languages)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => ({ name, count }))
            };
        } catch (error) {
            console.error(`GitHub API Error for ${username}:`, error.message);
            return null;
        }
    }

    /**
     * Fetch Codeforces stats using official API
     */
    async getCodeforcesStats(handle) {
        if (!handle) return null;
        try {
            const timeout = 5000;
            const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`, { timeout });
            const statusRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5000`, { timeout });

            if (infoRes.data.status !== "OK") return null;

            const user = infoRes.data.result[0];
            const submissions = statusRes.data.result || [];

            // Parse submissions into daily counts
            const calendarObj = {};
            submissions.forEach(sub => {
                // only count successful submissions
                if (sub.verdict === "OK") {
                    const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
                    calendarObj[date] = (calendarObj[date] || 0) + 1;
                }
            });

            const calendarMap = Object.entries(calendarObj).map(([date, count]) => ({ date, count }));

            return {
                rating: user.rating || 0,
                maxRating: user.maxRating || 0,
                rank: user.rank || "unrated",
                maxRank: user.maxRank || "unrated",
                contribution: user.contribution || 0,
                calendar: calendarMap
            };
        } catch (error) {
            console.error(`Codeforces API Error for ${handle}:`, error.message);
            return null;
        }
    }

    /**
     * Fetch LeetCode stats via GraphQL
     */
    async getLeetCodeStats(username) {
        if (!username) return null;

        // Fetch user stats and submission calendar
        const query = `
      query userProfile($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum { difficulty count }
          }
          userCalendar {
            submissionCalendar
          }
        }
      }
    `;

        try {
            const timeout = 5000;
            const res = await axios.post("https://leetcode.com/graphql", {
                query,
                variables: { username }
            }, {
                timeout,
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0"
                }
            });

            if (!res.data.data.matchedUser) return null;

            const matchedUser = res.data.data.matchedUser;
            const stats = matchedUser.submitStats.acSubmissionNum;

            // Parse Calendar JSON string from LeetCode
            let calendarMap = [];
            try {
                const subCalStr = matchedUser.userCalendar.submissionCalendar;
                if (subCalStr) {
                    const subCal = JSON.parse(subCalStr);
                    // LeetCode stores keys as UNIX timestamps in seconds
                    calendarMap = Object.entries(subCal).map(([timestampStr, count]) => {
                        const date = new Date(parseInt(timestampStr) * 1000).toISOString().split('T')[0];
                        return { date, count };
                    });
                }
            } catch (e) {
                console.error("Failed to parse LeetCode calendar");
            }

            return {
                totalSolved: stats.find(s => s.difficulty === "All")?.count || 0,
                easySolved: stats.find(s => s.difficulty === "Easy")?.count || 0,
                mediumSolved: stats.find(s => s.difficulty === "Medium")?.count || 0,
                hardSolved: stats.find(s => s.difficulty === "Hard")?.count || 0,
                calendar: calendarMap
            };
        } catch (error) {
            console.error(`LeetCode API Error for ${username}:`, error.message);
            return null;
        }
    }
}

module.exports = new AggregatorService();
