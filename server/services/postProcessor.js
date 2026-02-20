function safeJSONParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function isValidSchema(data) {
    return (
        data &&
        Array.isArray(data.headlines) &&
        data.headlines.length === 3 &&
        typeof data.slug === "string" &&
        typeof data.seo_title === "string" &&
        typeof data.seo_description === "string" &&
        typeof data.body === "string" &&
        Array.isArray(data.tags) &&
        data.tags.length === 5 &&
        typeof data.summary === "string"
    );
}

function removeDuplicateTags(tags) {
    const normalized = tags.map(tag => tag.trim().toLowerCase());
    return [...new Set(normalized)];
}

module.exports = async function processOutput(rawText, prompt, retryCount = 0) {
    let parsed = safeJSONParse(rawText);

    let retryTriggered = false;

    if (!parsed || !isValidSchema(parsed)) {
        if (retryCount < 1) {
            retryTriggered = true;
            const callModel = require("./modelService");
            const newRaw = await callModel(prompt);
            return module.exports(newRaw, prompt, retryCount + 1);
        } else {
            throw new Error("Invalid model response structure");
        }
    }

    const wordCount = parsed.body.split(/\s+/).length;

    if (wordCount < 350 || wordCount > 650) {
        if (retryCount < 1) {
            retryTriggered = true;
            const callModel = require("./modelService");
            const newRaw = await callModel(prompt);
            return module.exports(newRaw, prompt, retryCount + 1);
        } else {
            throw new Error("Body length out of acceptable range");
        }
    }

    parsed.tags = removeDuplicateTags(parsed.tags);

    parsed.slug = parsed.slug
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FF\-]/g, "");

    return {
        data: parsed,
        meta: {
            retryTriggered,
            validationStatus: "PASS"
        }
    };
};
