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
            const res = await axios.get(`https://api.github.com/users/${username}`);
            const repos = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);

            const languages = {};
            repos.data.forEach(repo => {
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });

            return {
                public_repos: res.data.public_repos,
                followers: res.data.followers,
                following: res.data.following,
                created_at: res.data.created_at,
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
            const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
            const ratingRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);

            if (infoRes.data.status !== "OK") return null;

            const user = infoRes.data.result[0];
            return {
                rating: user.rating || 0,
                maxRating: user.maxRating || 0,
                rank: user.rank || "unrated",
                maxRank: user.maxRank || "unrated",
                contribution: user.contribution || 0,
                ratingHistory: ratingRes.data.result.slice(-10) // Last 10 contests
            };
        } catch (error) {
            console.error(`Codeforces API Error for ${handle}:`, error.message);
            return null;
        }
    }

    /**
     * Fetch LeetCode stats via GraphQL (community-driven approach)
     */
    async getLeetCodeStats(username) {
        if (!username) return null;
        const query = `
      query userProblemsSolved($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum { difficulty count submissions }
          }
        }
      }
    `;

        try {
            const res = await axios.post("https://leetcode.com/graphql", {
                query,
                variables: { username }
            });

            if (!res.data.data.matchedUser) return null;

            const stats = res.data.data.matchedUser.submitStats.acSubmissionNum;
            return {
                totalSolved: stats.find(s => s.difficulty === "All")?.count || 0,
                easySolved: stats.find(s => s.difficulty === "Easy")?.count || 0,
                mediumSolved: stats.find(s => s.difficulty === "Medium")?.count || 0,
                hardSolved: stats.find(s => s.difficulty === "Hard")?.count || 0
            };
        } catch (error) {
            console.error(`LeetCode API Error for ${username}:`, error.message);
            return null;
        }
    }
}

module.exports = new AggregatorService();
