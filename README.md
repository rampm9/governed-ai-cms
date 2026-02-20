# Governed AI CMS

**AI-powered Arabic CMS Assistant with Governance, Evaluation, and Human-in-the-Loop Override Metrics**

This repository contains a production-style Arabic CMS prototype that goes beyond simple content generation. It demonstrates rigorous architectural control over generative AI outputs with:

- deterministic validation
- structured JSON enforcement
- hybrid evaluation (rule-based + AI critique)
- asynchronous critique pipelines
- human override tracking
- audit-ready lifecycle analysis

This is not a toy — it’s a governed, observable AI system.

---

## 📌 Motivation

Traditional editorial workflows are manual and slow.  
Basic AI integrations generate content, but lack:

- output validation
- production guardrails
- observability
- trust and override measurement

**Governed AI CMS** solves these by layering AI generation with deterministic checks and human feedback loops.

---

## 🧠 Key Concepts

**Deterministic Guardrails**
- JSON response enforcement
- Word-count enforcement with retry
- Slug normalization
- Tag deduplication

**Hybrid Evaluation**
- Deterministic rule-based scoring
- AI Critique (async, background)
- Combined confidence metrics

**Human-in-the-Loop Governance**
- Editor edits tracked
- Word-level override diff
- Override percentage computed

**Audit and Observability**
- `/api/audit/:id` exposes lifecycle state
- Critique and overrides stored in SQLite
- Metrics available for dashboards or dashboards

---

## 🚀 Architecture

```text
Editor UI → Express API
→ Structured Generation
→ Deterministic Validation
→ Deterministic Scoring
→ Async AI Critique → Database
→ Finalization w/ Override Tracking → Database
```

Layers include:

1. **Frontend (UI)**  
   Accepts topic, shows structured output, supports edits/finalize.

2. **Backend API (Node + Express)**  
   Endpoints:
   - `POST /api/generate`
   - `GET /api/audit/:id`
   - `POST /api/generate/finalize/:id`

3. **Model Layer**  
   Calls Gemini 2.5 Flash with `response_mime_type: "application/json"`.

4. **Post-Processing Guardrails**  
   Ensures schema compliance and safe outputs.

5. **Evaluation Pipeline**  
   Deterministic scoring + async AI critique.

6. **Persistence (SQLite)**  
   Stores:
   - original output
   - final editor output
   - override diff + percentage
   - critique JSON + status

---

## 🛠 Features

### ⚡ Fast Draft Generation
Returns structured content quickly with validation in place.

### 🧮 Hybrid Scoring
Captures rule-based and model-based quality assessment.

### 🗂 Async Critique
Background critique runs post-generation and is stored with lifecycle tracking (`PENDING → COMPLETE`).

### ✍️ Editor Override Tracking
Editors can refine the article body.  
The backend calculates:

```text
override % = (changed words / total words) × 100
```

Capturing editorial friction.

### 🔍 Audit Endpoints
Inspect completed critiques:

```http
GET /api/audit/:id
```

Return:

```json
{
  "generationId": 1,
  "critiqueStatus": "COMPLETE",
  "critique": {
    "score": 7,
    "critique": "..."
  }
}
```

---

## 📦 Setup

Clone repo:
```bash
git clone https://github.com/rampm9/governed-ai-cms.git
cd governed-ai-cms
```

Install dependencies:
```bash
npm install
```

Create `.env`:
```text
GEMINI_API_KEY=your_api_key_here
PORT=5001
```

Run server:
```bash
node server/index.js
```

Open in browser:
```text
http://localhost:5001
```
