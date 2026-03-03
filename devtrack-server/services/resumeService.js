const fs = require("fs");
const pdf = require("pdf-parse");

/**
 * Service to parse PDFs and calculate an ATS score based on keywords.
 */
class ResumeService {
    /**
     * Parse PDF resume and generate ATS analysis
     */
    async analyzeResume(filePath, role = "SDE") {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            const text = data.text.toLowerCase();

            // Keywords for SDE context
            const defaultKeywords = ["javascript", "node.js", "react", "express", "mongodb", "sql", "java", "python", "git", "docker", "aws", "api", "testing", "rest"];

            const foundKeywords = defaultKeywords.filter(kw => text.includes(kw));
            const missingKeywords = defaultKeywords.filter(kw => !text.includes(kw));

            const score = Math.round((foundKeywords.length / defaultKeywords.length) * 100);

            return {
                score,
                foundKeywords,
                missingKeywords,
                textPreview: text.substring(0, 200) + "..."
            };
        } catch (error) {
            console.error("Resume Parsing Error:", error.message);
            return null;
        }
    }
}

module.exports = new ResumeService();
