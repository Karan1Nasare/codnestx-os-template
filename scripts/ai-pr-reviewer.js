#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

function getPRDiff() {
  try {
    execSync("git fetch origin main");
    return execSync("git diff origin/main...HEAD").toString(); // ❌ no slice
  } catch (error) {
    return "No diff available";
  }
}

async function generateReview(diff) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
You are a senior code reviewer at CodnestX.

Review this PR code:

${diff}

Provide:
- Summary
- Issues
- Improvements
- Architecture feedback

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
    return "AI review failed";
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI review failed";
}

async function run() {
  console.log("🚀 Running AI PR Reviewer...");

  const diff = getPRDiff();
  const review = await generateReview(diff);

  // ✅ Save to file (BEST METHOD)
  fs.writeFileSync("review.md", review);

  console.log("✅ Review generated");
}

run();