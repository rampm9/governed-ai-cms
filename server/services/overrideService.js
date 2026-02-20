const Diff = require("diff");

function calculateOverride(originalText, editedText) {
    const diff = Diff.diffWords(originalText, editedText);

    let changedWords = 0;
    let totalWords = 0;

    diff.forEach(part => {
        const wordCount = part.value.split(/\s+/).filter(w => w.trim() !== "").length;
        totalWords += wordCount;

        if (part.added || part.removed) {
            changedWords += wordCount;
        }
    });

    const overridePercentage = totalWords === 0
        ? 0
        : Math.round((changedWords / totalWords) * 100);

    return {
        overridePercentage,
        diffSummary: diff
    };
}

module.exports = calculateOverride;
