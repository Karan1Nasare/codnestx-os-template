#!/usr/bin/env node

/**
 * CodnestX Auto Documentation Generator (Level 1)
 * Generates:
 * - Changelog
 * - Auto Docs with Code Diff
 */

const fs = require("fs");
const { execSync } = require("child_process");

// Paths
const DOCS_PATH = "./docs";
const AUTO_PATH = "./docs/auto";
const CHANGELOG_PATH = `${DOCS_PATH}/changelog/CHANGELOG.md`;

// Ensure folders exist
function ensureDirs() {
  const dirs = [
    "./docs",
    "./docs/auto",
    "./docs/api",
    "./docs/changelog",
    "./docs/architecture",
    "./docs/user-stories",
    "./docs/schema",
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Get latest commit message
function getGitChanges() {
  try {
    const output = execSync("git log -1 --pretty=format:%B").toString().trim();
    return output || "No commit message provided";
  } catch (err) {
    return "No commit data found";
  }
}

// Get git diff (last commit)
function getGitDiff() {
  try {
    const diff = execSync("git diff HEAD~1 HEAD").toString();
    return diff.slice(0, 5000); // Limit size (important for future AI)
  } catch (err) {
    return "No diff available";
  }
}

// Generate Changelog
function generateChangelog(commitMsg) {
  const date = new Date().toISOString();

  const entry = `
## ${date}
- ${commitMsg}
`;

  if (!fs.existsSync(CHANGELOG_PATH)) {
    fs.writeFileSync(CHANGELOG_PATH, "# Changelog\n");
  }

  fs.appendFileSync(CHANGELOG_PATH, entry);
}

// Generate Auto Doc File
function generateAutoDoc(commitMsg, diff) {
  const fileName = `${AUTO_PATH}/doc-${Date.now()}.md`;

  const content = `
# 🚀 CodnestX Auto Generated Doc

## 📌 Change Summary
${commitMsg}

---

## 🧾 Code Changes (Diff)
\`\`\`
${diff}
\`\`\`

---

## ⚡ Possible Impact
- Review related modules
- API endpoints might be affected
- UI components may need updates

---

## 🧠 Developer Notes
- Ensure backward compatibility
- Validate schema changes
- Test edge cases

---

## 📍 Next Steps (Recommended)
- Run application locally
- Verify affected modules
- Update manual docs if needed
`;

  fs.writeFileSync(fileName, content);
}

// Main runner
function run() {
  console.log("🚀 Running CodnestX Auto Doc Generator...");

  ensureDirs();

  const commitMsg = getGitChanges();
  const diff = getGitDiff();

  generateChangelog(commitMsg);
  generateAutoDoc(commitMsg, diff);

  console.log("✅ Docs generated successfully!");
}

run();