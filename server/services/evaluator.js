function countWords(text) {
    return text.split(/\s+/).filter(w => w.trim() !== "").length;
}

function keywordPresenceScore(keyword, text) {
    const occurrences = (text.match(new RegExp(keyword, "g")) || []).length;
    return occurrences > 0 ? 1 : 0;
}

function repetitionCheck(text) {
    const sentences = text.split(/[.!؟]/);
    const unique = new Set(sentences.map(s => s.trim()));
    const ratio = unique.size / sentences.length;
    return ratio; // closer to 1 = less repetition
}

module.exports = function evaluateContent(input, content) {

    const bodyWordCount = countWords(content.body);

    const keywordScore = keywordPresenceScore(input.split(" ")[0], content.body);

    const repetitionRatio = repetitionCheck(content.body);

    let qualityScore = 0;

    // Word count scoring
    if (bodyWordCount >= 400 && bodyWordCount <= 550) {
        qualityScore += 3;
    }

    // Keyword presence scoring
    qualityScore += keywordScore * 2;

    // Repetition scoring
    if (repetitionRatio > 0.7) {
        qualityScore += 3;
    }

    // SEO title presence
    if (content.seo_title && content.seo_title.length > 10) {
        qualityScore += 2;
    }

    return {
        bodyWordCount,
        keywordScore,
        repetitionRatio,
        qualityScore
    };
};