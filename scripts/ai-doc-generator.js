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
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are a senior software architect at CodnestX.

Project Context:
${context}

Commit Message:
${commitMsg}

Code Changes:
${diff}

Generate:
1. Change Log
2. Implementation Details
3. API Documentation
4. User Story
5. Schema Changes
6. Architecture Impact

Return clean markdown.
`
              }
            ]
          }
        ]
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Gemini Error:", data);
    return "AI generation failed";
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI generation failed";
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