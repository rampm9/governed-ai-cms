let currentGenerationId = null;

const inputField = document.getElementById("inputText");
const generateBtn = document.getElementById("generateBtn");
const outputDiv = document.getElementById("output");
const metricsPanel = document.getElementById("metricsPanel");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("errorMessage");
const charCount = document.getElementById("charCount");

inputField.addEventListener("input", () => {
    charCount.textContent = inputField.value.length + " characters";
});

generateBtn.addEventListener("click", async () => {
    const input = inputField.value.trim();

    if (!input) {
        errorDiv.textContent = "Input required.";
        return;
    }

    errorDiv.textContent = "";
    loadingDiv.classList.remove("hidden");
    metricsPanel.classList.add("hidden");
    outputDiv.innerHTML = "";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ input })
        });

        const result = await response.json();

        currentGenerationId = result.generationId || (result.meta && result.meta.generationId) || null;

        if (result.error) {
            throw new Error(result.error + (result.details ? " - " + result.details : ""));
        }

        renderContent(result.content);
        renderMetrics(result.meta);

    } catch (err) {
        errorDiv.textContent = err.message;
    } finally {
        loadingDiv.classList.add("hidden");
    }
});

function renderContent(content) {
    outputDiv.innerHTML = "";

    renderSection("Headlines", content.headlines.join("\n"));
    renderSection("Slug", content.slug);
    renderSection("SEO Title", content.seo_title);
    renderParagraphSection(content.seo_description, "SEO Description");
    renderArticleBody(content.body);
    renderTags(content.tags);
    renderParagraphSection(content.summary, "Summary");
}

function renderSection(title, value) {
    const div = document.createElement("div");
    div.className = "section";
    div.innerHTML = `
  <div class="section-header">
    <h3>${title}</h3>
    <button class="copy-btn">Copy</button>
  </div>
  <pre>${value}</pre>
`;

    div.querySelector(".copy-btn").addEventListener("click", () => {
        navigator.clipboard.writeText(value);
    });

    outputDiv.appendChild(div);
}

function renderTags(tags) {
    const div = document.createElement("div");
    div.className = "section tags";
    div.innerHTML = "<h3>Tags</h3>";

    tags.forEach(tag => {
        const span = document.createElement("span");
        span.textContent = tag;
        div.appendChild(span);
    });

    outputDiv.appendChild(div);
}

function renderMetrics(meta) {
    metricsPanel.classList.remove("hidden");

    let qualityLabel = "";
    let qualityClass = "";

    if (meta.qualityScore >= 8) {
        qualityLabel = "Excellent";
        qualityClass = "quality-good";
    } else if (meta.qualityScore >= 6) {
        qualityLabel = "Good";
        qualityClass = "quality-medium";
    } else {
        qualityLabel = "Needs Review";
        qualityClass = "quality-bad";
    }

    metricsPanel.innerHTML = `
    <div class="metrics-row">
      <strong>Quality:</strong> 
      <span class="quality-badge ${qualityClass}">
        ${meta.qualityScore}/10 - ${qualityLabel}
      </span>
    </div>

    <div class="metrics-row">
      <strong>Word Count:</strong> ${meta.bodyWordCount}
    </div>

    <div class="metrics-row">
      <strong>Generation Time:</strong> ${meta.generationTimeMs} ms
    </div>

    ${meta.retryTriggered
            ? `<div class="retry-note">Regenerated due to constraint adjustment.</div>`
            : ""
        }
  `;
}

function renderParagraphSection(text, title = "Section") {
    const div = document.createElement("div");
    div.className = "section";

    const paragraphs = text.split("\n").filter(p => p.trim() !== "");

    div.innerHTML = `
    <div class="section-header">
      <h3>${title}</h3>
      <button class="copy-btn">Copy</button>
    </div>
  `;

    paragraphs.forEach(p => {
        const para = document.createElement("p");
        para.textContent = p;
        div.appendChild(para);
    });

    div.querySelector(".copy-btn").addEventListener("click", () => {
        navigator.clipboard.writeText(text);
    });

    outputDiv.appendChild(div);
}

function renderArticleBody(text) {
    const div = document.createElement("div");
    div.className = "section";

    div.innerHTML = `
    <div class="section-header">
      <h3>Article Body</h3>
      <button class="copy-btn">Copy</button>
    </div>
    <textarea id="editableBody" class="editable-body">${text}</textarea>
    <button id="finalizeBtn" class="finalize-btn">Finalize & Save</button>
    <div id="overrideInfo"></div>
  `;

    div.querySelector(".copy-btn").addEventListener("click", () => {
        navigator.clipboard.writeText(document.getElementById("editableBody").value);
    });

    outputDiv.appendChild(div);

    document.getElementById("finalizeBtn").addEventListener("click", finalizeArticle);
}

async function finalizeArticle() {
    if (!currentGenerationId) return;

    const editedBody = document.getElementById("editableBody").value;

    try {
        const response = await fetch(`/api/generate/finalize/${currentGenerationId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                editedContent: {
                    body: editedBody
                }
            })
        });

        const result = await response.json();

        document.getElementById("overrideInfo").innerHTML = `
      <div class="override-badge">
        Edit Delta: ${result.overridePercentage}%
      </div>
    `;

    } catch (err) {
        console.error("Finalize error:", err.message);
    }
}