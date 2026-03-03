/**
 * Combines daily activity from different platforms into a unified 365-day map.
 * Format is expected to be arrays of { date: 'YYYY-MM-DD', count: number }
 */
exports.mergeHeatmapData = (leetcodeDays = [], codeforcesDays = [], githubDays = []) => {
    const unified = {};

    // Helper to safely add to the unified map
    const addData = (daysArray, platformName) => {
        if (!Array.isArray(daysArray)) return;

        daysArray.forEach(day => {
            if (!day.date) return;

            if (!unified[day.date]) {
                unified[day.date] = {
                    date: day.date,
                    total: 0,
                    leetcode: 0,
                    codeforces: 0,
                    github: 0
                };
            }

            unified[day.date][platformName] = (unified[day.date][platformName] || 0) + (day.count || 0);
            unified[day.date].total += (day.count || 0);
        });
    };

    addData(leetcodeDays, 'leetcode');
    addData(codeforcesDays, 'codeforces');
    addData(githubDays, 'github');

    // Convert map to array and sort by date ascending
    const sortedArray = Object.values(unified).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Limit to last 365 days if there's more data
    if (sortedArray.length > 365) {
        return sortedArray.slice(-365);
    }

    return sortedArray;
};

/**
 * Normalizes consistency intensity score (0-4 max)
 * Based on total contributions in a day
 */
exports.calculateIntensity = (totalCount) => {
    if (totalCount === 0) return 0;
    if (totalCount <= 2) return 1;
    if (totalCount <= 5) return 2;
    if (totalCount <= 10) return 3;
    return 4; // High frequency
};

/**
 * Calculates a 0-100 Consistency Score based on activity.
 * Formula considers:
 * - Active days in last 30 days (40%)
 * - Current Streak (30%)
 * - Weekly Average comparing to ideal (30%)
 */
exports.calculateConsistencyScore = (unifiedHeatmapArray) => {
    if (!unifiedHeatmapArray || unifiedHeatmapArray.length === 0) return 0;

    const now = new Date();
    // Reset time to start of today for accurate counting
    now.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let activeDaysLast30 = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalLast90Days = 0;

    // We iterate backwards from today
    let checkDate = new Date(now);
    let isStreakActive = true;

    // Convert array to a quick lookup map
    const dateMap = {};
    unifiedHeatmapArray.forEach(item => {
        dateMap[item.date] = item.total;
    });

    // Loop through the last 365 days backwards to calculate streaks
    for (let i = 0; i < 365; i++) {
        const dateString = checkDate.toISOString().split('T')[0];
        const count = dateMap[dateString] || 0;

        // Active days in last 30
        if (i < 30 && count > 0) {
            activeDaysLast30++;
        }

        // 90 day running total (for weekly average)
        if (i < 90) {
            totalLast90Days += count;
        }

        // Streak logic
        if (count > 0) {
            tempStreak++;
            if (isStreakActive) {
                currentStreak++;
            }
        } else {
            // Missing a day breaks the streak. 
            // Allow missing today, but if yesterday is missing, streak is dead.
            if (i > 0) {
                isStreakActive = false;
            }
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            tempStreak = 0;
        }

        checkDate.setDate(checkDate.getDate() - 1); // Go back one day
    }

    if (tempStreak > longestStreak) longestStreak = tempStreak;

    // 1. Active Last 30 (Goal: 20 active days = 100% of this metric)
    const activeScore = Math.min(activeDaysLast30 / 20 * 40, 40);

    // 2. Current Streak (Goal: 14 days = 100% of this metric)
    const streakScore = Math.min(currentStreak / 14 * 30, 30);

    // 3. Weekly Average (Goal: 15 contributions a week = roughly 192 in 90 days)
    const weeklyAverageScore = Math.min(totalLast90Days / 192 * 30, 30);

    const rawScore = activeScore + streakScore + weeklyAverageScore;
    return Math.round(Math.min(rawScore, 100));
};
