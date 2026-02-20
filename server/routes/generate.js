const express = require("express");
const router = express.Router();

const buildPrompt = require("../services/promptBuilder");
const callModel = require("../services/modelService");
const processOutput = require("../services/postProcessor");
const { logGeneration, logCritique, markCritiqueFailed } = require("../services/logger");
const evaluateContent = require("../services/evaluator");
const critiqueContent = require("../services/critiqueService");
const calculateOverride = require("../services/overrideService");

router.post("/", async (req, res) => {
    const startTime = Date.now();

    try {
        const { input } = req.body;

        if (!input || input.length === 0) {
            return res.status(400).json({ error: "Input is required." });
        }

        if (input.length > 2000) {
            return res.status(400).json({ error: "Input too long." });
        }

        const prompt = buildPrompt(input);
        const rawResponse = await callModel(prompt);
        const { data, meta } = await processOutput(rawResponse, prompt);

        const evaluation = evaluateContent(input, data);
        const generationId = await logGeneration(input, data);

        const generationTimeMs = Date.now() - startTime;

        // 🚀 Return immediate response to UI
        res.json({
            generationId,
            content: data,
            meta: {
                generationTimeMs,
                retryTriggered: meta.retryTriggered,
                validationStatus: meta.validationStatus,
                deterministicScore: evaluation.qualityScore,
                bodyWordCount: evaluation.bodyWordCount
            }
        });

        // 🏎️ Fire & Forget Critique: Async process continues outside the HTTP request
        critiqueContent(data)
            .then(async (aiCritique) => {
                await logCritique(generationId, aiCritique);
            })
            .catch(async (err) => {
                console.error("Background critique failed:", err.message);
                await markCritiqueFailed(generationId);
            });

    } catch (error) {
        console.error("Generation error:", error.message);

        return res.status(500).json({
            error: "Generation failed.",
            details: error.message
        });
    }
});

router.get("/audit/:id", async (req, res) => {
    const sqlite3 = require("sqlite3").verbose();
    const path = require("path");
    const dbPath = path.join(__dirname, "../db/database.sqlite");
    const db = new sqlite3.Database(dbPath);

    const { id } = req.params;

    db.get(
        `SELECT id, critique_status, critique FROM generations WHERE id = ?`,
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }

            if (!row) {
                return res.status(404).json({ error: "Not found" });
            }

            res.json({
                generationId: row.id,
                critiqueStatus: row.critique_status,
                critique: row.critique ? JSON.parse(row.critique) : null
            });
        }
    );
});

router.post("/finalize/:id", async (req, res) => {
    const sqlite3 = require("sqlite3").verbose();
    const path = require("path");
    const dbPath = path.join(__dirname, "../db/database.sqlite");
    const db = new sqlite3.Database(dbPath);

    const { id } = req.params;
    const { editedContent } = req.body;

    db.get(
        `SELECT output FROM generations WHERE id = ?`,
        [id],
        async (err, row) => {
            if (err) return res.status(500).json({ error: "DB error" });
            if (!row) return res.status(404).json({ error: "Not found" });

            const original = JSON.parse(row.output);

            const overrideResult = calculateOverride(
                original.body,
                editedContent.body
            );

            db.run(
                `UPDATE generations 
         SET final_output = ?, 
             override_delta = ?, 
             override_percentage = ?
         WHERE id = ?`,
                [
                    JSON.stringify(editedContent),
                    JSON.stringify(overrideResult.diffSummary),
                    overrideResult.overridePercentage,
                    id
                ],
                function (err) {
                    if (err) return res.status(500).json({ error: "Update failed" });

                    res.json({
                        message: "Final version saved",
                        overridePercentage: overrideResult.overridePercentage
                    });
                }
            );
        }
    );
});

module.exports = router;