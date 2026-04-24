const { execSync } = require("child_process");

function safeExec(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}

const commitHash =
  process.env.EAS_BUILD_GIT_COMMIT_HASH ||
  process.env.GITHUB_SHA ||
  safeExec("git rev-parse HEAD") ||
  "dev";

const shortCommit = commitHash.substring(0, 7);
const buildProfile = process.env.EAS_BUILD_PROFILE || "local";
const buildRunner =
  process.env.EAS_BUILD_RUNNER ||
  (process.env.GITHUB_ACTIONS ? "github-actions" : "local");
const buildTime = new Date().toISOString();

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra || {}),
    build: {
      commitHash,
      shortCommit,
      profile: buildProfile,
      runner: buildRunner,
      time: buildTime,
    },
  },
});
