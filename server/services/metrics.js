let retryCount = 0;
let validationFailures = 0;
let totalGenerations = 0;

function incrementRetry() {
    retryCount++;
}

function incrementFailure() {
    validationFailures++;
}

function incrementGeneration() {
    totalGenerations++;
}

function getMetrics() {
    return {
        totalGenerations,
        retryCount,
        validationFailures,
        retryRate: totalGenerations ? (retryCount / totalGenerations) : 0,
        failureRate: totalGenerations ? (validationFailures / totalGenerations) : 0
    };
}

module.exports = {
    incrementRetry,
    incrementFailure,
    incrementGeneration,
    getMetrics
};
