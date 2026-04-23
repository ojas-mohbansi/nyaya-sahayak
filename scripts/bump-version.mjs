#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const releaseType = (process.argv[2] || "patch").toLowerCase();
if (!["major", "minor", "patch"].includes(releaseType)) {
  console.error(`Unknown release type "${releaseType}". Use one of: major | minor | patch`);
  process.exit(1);
}

const noGit = process.argv.includes("--no-git");
const noPush = process.argv.includes("--no-push");
const skipChecks = process.argv.includes("--skip-checks");

if (!skipChecks) {
  const checks = [
    { name: "typecheck", cmd: "npm run typecheck" },
    { name: "lint", cmd: "npm run lint" },
  ];
  for (const check of checks) {
    console.log(`Running pre-release check: ${check.name}…`);
    try {
      execSync(check.cmd, { stdio: "inherit", cwd: resolve(__dirname, "..") });
    } catch {
      console.error(`\nPre-release check "${check.name}" failed. Aborting release.`);
      console.error("Fix the errors above, or re-run with --skip-checks to bypass.");
      process.exit(1);
    }
  }
  console.log("All pre-release checks passed.\n");
}

const appJsonPath = resolve(root, "app.json");
const pkgJsonPath = resolve(root, "package.json");

const appJson = JSON.parse(readFileSync(appJsonPath, "utf8"));
const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

const currentVersion = appJson.expo.version || "0.0.0";
const [maj, min, pat] = currentVersion.split(".").map((n) => parseInt(n, 10) || 0);

let next;
if (releaseType === "major") next = `${maj + 1}.0.0`;
else if (releaseType === "minor") next = `${maj}.${min + 1}.0`;
else next = `${maj}.${min}.${pat + 1}`;

const currentVersionCode = appJson.expo.android?.versionCode ?? 0;
const nextVersionCode = currentVersionCode + 1;

appJson.expo.version = next;
appJson.expo.android = appJson.expo.android || {};
appJson.expo.android.versionCode = nextVersionCode;

if (appJson.expo.ios) {
  appJson.expo.ios.buildNumber = String(nextVersionCode);
}

pkgJson.version = next;

writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n");
writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");

console.log(`Version: ${currentVersion} → ${next}`);
console.log(`android.versionCode: ${currentVersionCode} → ${nextVersionCode}`);
if (appJson.expo.ios) {
  console.log(`ios.buildNumber: ${nextVersionCode}`);
}

const tag = `v${next}`;
const changelogPath = resolve(root, "CHANGELOG.md");

function getCommitsSinceLastTag() {
  let range = "";
  try {
    const lastTag = execSync("git describe --tags --abbrev=0", {
      cwd: root,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (lastTag) range = `${lastTag}..HEAD`;
  } catch {
    range = "";
  }
  try {
    const log = execSync(`git log ${range} --pretty=format:"- %s (%h)" --no-merges`, {
      cwd: root,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return log;
  } catch {
    return "";
  }
}

function categorizeCommits(log) {
  if (!log) return "- _No commits since last release._\n";
  const sections = {
    Added: [],
    Changed: [],
    Fixed: [],
    Other: [],
  };
  for (const line of log.split("\n")) {
    if (/^- (feat|add)(\(|:|!)/i.test(line)) sections.Added.push(line);
    else if (/^- fix(\(|:|!)/i.test(line)) sections.Fixed.push(line);
    else if (/^- (refactor|perf|chore|style|build|ci|docs|release)(\(|:|!)/i.test(line))
      sections.Changed.push(line);
    else sections.Other.push(line);
  }
  let out = "";
  for (const [name, items] of Object.entries(sections)) {
    if (items.length) out += `\n### ${name}\n${items.join("\n")}\n`;
  }
  return out || `\n${log}\n`;
}

function updateChangelog() {
  let existing = "";
  try {
    existing = readFileSync(changelogPath, "utf8");
  } catch {
    existing = `# Changelog\n\n## [Unreleased]\n`;
  }
  const date = new Date().toISOString().slice(0, 10);
  const commits = getCommitsSinceLastTag();
  const body = categorizeCommits(commits);
  const entry = `## [${next}] - ${date}\n${body}`;
  let updated;
  if (existing.includes("## [Unreleased]")) {
    updated = existing.replace("## [Unreleased]", `## [Unreleased]\n\n${entry}`);
  } else {
    updated = `${existing.trimEnd()}\n\n${entry}\n`;
  }
  writeFileSync(changelogPath, updated);
  console.log(`Updated CHANGELOG.md with ${commits.split("\n").filter(Boolean).length} commits.`);
  return entry;
}

const changelogEntry = updateChangelog();

if (noGit) {
  console.log("Skipping git commit/tag (--no-git).");
  process.exit(0);
}

try {
  execSync(`git add app.json package.json package-lock.json CHANGELOG.md`, {
    stdio: "inherit",
    cwd: root,
  });
  execSync(`git commit -m "chore(release): ${tag}"`, { stdio: "inherit", cwd: root });
  execSync(`git tag -a ${tag} -F -`, {
    stdio: ["pipe", "inherit", "inherit"],
    cwd: root,
    input: `${tag}\n\n${changelogEntry}`,
  });
  console.log(`Created commit and tag ${tag}.`);

  if (!noPush) {
    execSync(`git push`, { stdio: "inherit", cwd: root });
    execSync(`git push origin ${tag}`, { stdio: "inherit", cwd: root });
    console.log(`Pushed ${tag} — GitHub Actions will build the APK and attach it to the release.`);
  } else {
    console.log("Skipping git push (--no-push). Push manually with:");
    console.log(`  git push && git push origin ${tag}`);
  }
} catch (err) {
  console.error("Git step failed:", err.message);
  process.exit(1);
}
