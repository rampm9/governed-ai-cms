const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../db/database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      input TEXT,
      output TEXT,
      final_output TEXT,
      override_delta TEXT,
      override_percentage REAL,
      critique TEXT,
      critique_status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports.logGeneration = function (input, output) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO generations (input, output, critique_status) VALUES (?, ?, 'PENDING')`,
            [input, JSON.stringify(output)],
            function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            }
        );
    });
};

module.exports.logCritique = function (id, critiqueData) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE generations SET critique = ?, critique_status = 'COMPLETE' WHERE id = ?`,
            [JSON.stringify(critiqueData), id],
            function (err) {
                if (err) return reject(err);
                resolve();
            }
        );
    });
};

module.exports.markCritiqueFailed = function (id) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE generations SET critique_status = 'FAILED' WHERE id = ?`,
            [id],
            function (err) {
                if (err) return reject(err);
                resolve();
            }
        );
    });
};
