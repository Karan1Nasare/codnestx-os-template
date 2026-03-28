#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

// Get commit message
function getCommitMsg() {
  try {
    return execSync("git log -1 --pretty=format:%B").toString();
  } catch {
    return "No commit message";
  }
}

// Get diff
function getGitDiff() {
  try {
    return execSync("git diff HEAD~1 HEAD").toString().slice(0, 4000);
  } catch (err) {
    try {
      return execSync("git show --stat").toString().slice(0, 4000);
    } catch {
      return "No diff available";
    }
  }
}

// Load Windsurf Context (IMPORTANT)
function getContext() {
  try {
    return fs.readFileSync("./ai-rules/windsurf-context.md", "utf-8");
  } catch {
    return "No context available";
  }
}

// Call OpenAI
async function generateAI(commitMsg, diff, context) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: `
You are a senior software architect at CodnestX.

Project Context:
${context}

Commit Message:
${commitMsg}

Code Changes:
${diff}

Analyze and generate:

1. Change Log (clear summary)
2. Implementation Details (what was done technically)
3. API Documentation (if any API impacted)
4. User Story (business perspective)
5. Schema Changes (if DB affected)
6. Architecture Impact (system-level thinking)

Return clean structured markdown.
`
        }
      ]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "AI generation failed";
}

// Save doc
function saveDoc(content) {
  const path = `./docs/auto/ai-doc-${Date.now()}.md`;
  fs.writeFileSync(path, content);
}

// MAIN
async function run() {
  console.log("🚀 Running AI Doc Generator...");

  const commitMsg = getCommitMsg();
  const diff = getGitDiff();
  const context = getContext();

  const aiDoc = await generateAI(commitMsg, diff, context);

  saveDoc(aiDoc);

  console.log("✅ AI Docs Generated");
}

run();