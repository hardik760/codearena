const aggregatorService = require('./services/aggregatorService');

async function test() {
    console.log("Testing GitHub...");
    const gh = await aggregatorService.getGitHubStats('hardik760');
    console.log("GitHub:", gh ? "Success" : "Failed");

    console.log("Testing LeetCode...");
    const lc = await aggregatorService.getLeetCodeStats('hardik_singh2992');
    console.log("LeetCode:", lc ? "Success" : "Failed");

    console.log("Testing Codeforces...");
    const cf = await aggregatorService.getCodeforcesStats('NAM2HARDIK');
    console.log("Codeforces:", cf ? "Success" : "Failed");
}

test();
