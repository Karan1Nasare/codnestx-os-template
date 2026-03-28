#!/usr/bin/env node

const { execSync } = require("child_process");

async function getPRDiff() {
  try {
    return execSync("git diff origin/main...HEAD").toString().slice(0, 4000);
  } catch {
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

Review this code:

${diff}

Provide:
1. Summary
2. Issues
3. Improvements
4. Architecture feedback

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
    return "Review failed";
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Review failed";
}

async function run() {
  console.log("🚀 Running AI PR Reviewer...");

  const diff = await getPRDiff();
  const review = await generateReview(diff);

  console.log(review);
}

run();