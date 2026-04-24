# Nyaya Sahayak — न्याय सहायक

**Law in your language — Justice in your hands**

> Zero-Cost Legal Aid · Offline-First · India 2026

Nyaya Sahayak is a free, offline-first mobile application built for the India that lives beyond wifi — for the farmer who doesn't know his property rights, the woman afraid to file an FIR, the migrant worker cheated of his wages. The law belongs to everyone.

300 million Indians qualify for legal aid. Almost none receive it.

**Website:** https://ojas-mohbansi.github.io/nsw/  
**Repository:** https://github.com/ojas-mohbansi/nyaya-sahayak  
**Contact:** ojasmohbansi+nyayasahayak@gmail.com

---

## Features

### 01 — Know Your Rights
A searchable repository of 53+ fundamental rights and legal protections explained in plain language. Covers Articles 14–32 of the Indian Constitution, labour protections, women's rights, and emergency legal provisions. Verified content, offline always.

### 02 — Apply For
Step-by-step guidance for 25+ government documents and welfare schemes. No jargon, no guesswork — numbered steps for Aadhaar, Voter ID, Ration Card, RTI filing, and more. Designed so a first-time user can follow it alone.

### 03 — Where To Go
Fully offline maps using pre-bundled OpenStreetMap tiles. Government offices, legal aid centres, and district courts pre-loaded with GPS navigation. No mobile data required.

### 04 — Emergency SOS
One-touch emergency alerts with auto location-sharing to privately-stored contacts. Built first for women facing domestic violence, but designed for anyone in immediate danger. Contacts are never synced to any server — they stay on your device.

---

## Principles

| Principle | Detail |
|-----------|--------|
| 100% Offline | No servers, no API calls. SQLite with full-text search stores everything locally. |
| Private by Design | Zero data collection. No tracking or analytics. Emergency contacts never leave the device. |
| 17 Languages | Hindi, Tamil, Telugu, Bengali, Urdu, Marathi, Gujarati, Odia, Punjabi, Kannada, Malayalam, Assamese, Kashmiri, Kokborok, Nepali, Sanskrit, English. |
| Runs on Basic Phones | Under 50 MB. Launches in 3 seconds. Android 8.0+ and iOS 14.0+. |

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | React Native 0.81 |
| Build Tool | Expo SDK 54 |
| Language | TypeScript 5.9 |
| Navigation | Expo Router 6 |
| Database | expo-sqlite 16 with FTS5 |
| State | React Context + AsyncStorage |
| Maps | Leaflet + OpenStreetMap (offline-ready) |
| Animations | react-native-reanimated 4 |
| Platforms | Android 8.0+ · iOS 14.0+ |

---

## Setup & Development

### Prerequisites

- Node.js 20+
- npm 10+
- Expo Go app on your phone (for device testing)

### Install

```bash
git clone https://github.com/ojas-mohbansi/nyaya-sahayak.git
cd nyaya-sahayak
npm install
```

### Run in Development

```bash
npm run dev
```

This starts the Expo development server. You can then:
- Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS) to run on your device
- Press `w` to open in a web browser

### Type Check

```bash
npm run typecheck
```

### Formatting (Prettier)

```bash
npm run format        # rewrite all files
npm run format:check  # verify only (used in CI)
```

Config lives in `.prettierrc.json`. ESLint is configured with `eslint-config-prettier` so style rules don't conflict with lint rules.

### Git hooks (Husky + lint-staged)

A pre-commit hook runs `lint-staged` (Prettier + ESLint `--fix` on staged files) followed by `npm run typecheck`. Husky installs automatically on `npm install` via the `prepare` script. If hooks aren't firing, run:

```bash
npx husky
```

To bypass once (not recommended): `git commit --no-verify`.

---

## Building for Production

You have **three** ways to produce a universal Android APK (one file, all CPU architectures: `arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64`). All three produce a binary that installs on any Android 8.0+ device.

| Method | Time | Cost | When to use |
| --- | --- | --- | --- |
| EAS cloud (`eas build`) | 5–60 min (queue) | EAS minutes | Default. Hands-off, signed for store. |
| Local (your machine, `--local`) | 5–10 min | Free | Skip EAS queue; need JDK 17 + Android SDK. |
| GitHub Actions (Gradle, no EAS) | ~15 min | Free (public repo) | Skip EAS entirely; great for CI. |

### Convenience npm scripts

```bash
npm run build:apk:cloud   # EAS cloud, fire-and-forget
npm run build:apk:local   # local Gradle build → ./build/nyaya-sahayak.apk
npm run build:apk:both    # both at once — first one done wins
```

### 1. EAS cloud build

```bash
npm install -g eas-cli
eas login

# Internal-distribution APK (for testers)
eas build --platform android --profile preview

# Store-distribution APK (universal)
eas build --platform android --profile production-apk
```

When the build finishes, EAS prints a download URL — install the APK on any Android 8.0+ device by enabling "Install from unknown sources".

### 2. Local build with EAS CLI

Builds the same APK on your own machine — no queue, no EAS minutes consumed.

**Prerequisites:** JDK 17 + Android SDK (Android Studio installs both), and `eas-cli` logged in.

```bash
npm run build:apk:local
# → outputs ./build/nyaya-sahayak.apk
```

Under the hood this runs `eas build -p android --profile production-apk --local`.

### 3. GitHub Actions (no EAS at all)

`.github/workflows/local-build-apk.yml` builds the APK directly with Gradle on a free GitHub-hosted runner. Trigger from the **Actions** tab → "Local Build - Android APK (no EAS)" → "Run workflow". The APK is attached as a workflow artifact and kept for 30 days.

This route is useful if you've exhausted EAS minutes or want a free CI pipeline for sideload-only builds. The APK is signed with the default debug keystore — perfect for sideloading and testing, **not** for Play Store submission.

### Build metadata baked into every APK

`app.config.js` injects build provenance into `Constants.expoConfig.extra.build` at build time:

| Field | Source |
| --- | --- |
| `commitHash` / `shortCommit` | `EAS_BUILD_GIT_COMMIT_HASH` → `GITHUB_SHA` → local `git rev-parse` → `dev` |
| `profile` | `EAS_BUILD_PROFILE` (e.g. `production-apk`) or `local` |
| `runner` | `eas-build`, `github-actions`, or `local` |
| `time` | ISO timestamp when the JS bundle was built |

The Settings screen renders `version (versionCode)` automatically. The Developer screen has a tap-to-expand **Build info** card that shows everything above and lets users copy it for bug reports.

### iOS (IPA)

```bash
eas build --platform ios
```

> iOS builds require an Apple Developer account.

### Dependency updates (Dependabot)

`.github/dependabot.yml` opens weekly PRs (Mondays, 06:00 IST) for:

- **npm packages** — grouped into `expo`, `react-native`, `types`, and `lint-format` bundles to reduce PR noise. Major bumps for `react`, `react-native`, and `expo` are ignored (handled manually with the Expo SDK upgrade flow).
- **GitHub Actions** — keeps `actions/checkout`, `actions/setup-node`, etc. on the latest versions.

PRs are auto-validated by the Quality workflow above, so you can merge confidently once checks are green.

### Quality checks (GitHub Actions)

`.github/workflows/quality.yml` runs on every push to `main` and every pull request:

1. `npm run format:check` — Prettier formatting verification
2. `npm run lint` — ESLint (must be 0 errors)
3. `npm run typecheck` — TypeScript

PRs that fail any step are blocked from merging (configure branch protection in your repo settings).

### Automated CI/CD (GitHub Actions)

`.github/workflows/build.yml` runs EAS builds automatically:

- **Push to `main`** (touching app code/config) → kicks off an Android APK build using the `production-apk` profile (fire-and-forget; track progress on [expo.dev](https://expo.dev)).
- **Manual run** (Actions tab → "EAS Build - Android APK" → "Run workflow") → choose between `preview` and `production-apk` profiles.
- **Tag push** matching `v*` (e.g. `git tag v1.0.0 && git push --tags`) → builds the APK, waits for completion, downloads it, and attaches it to a GitHub Release for that tag.

Required repository secret:

| Secret | Where to get it |
| --- | --- |
| `EXPO_TOKEN` | https://expo.dev/accounts/&lt;you&gt;/settings/access-tokens |

### Changelog

`CHANGELOG.md` is updated automatically by the release script. On each `npm run release:*`:

1. Collects all commits since the previous git tag
2. Categorizes them by Conventional Commits prefix (`feat:` → Added, `fix:` → Fixed, `chore/refactor/perf/style/build/ci/docs:` → Changed, anything else → Other)
3. Prepends a new `## [vX.Y.Z] - YYYY-MM-DD` section under `## [Unreleased]`
4. Includes the full section as the annotated git tag's body and as the GitHub Release notes (replacing auto-generated notes)

Use Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, etc.) for clean categorization.

### Cutting a release

Use the bundled bump script — it updates `app.json` (`expo.version`, `android.versionCode`, `ios.buildNumber`) and `package.json`, commits, tags, and pushes:

```bash
npm run release:patch    # 1.0.0 → 1.0.1
npm run release:minor    # 1.0.1 → 1.1.0
npm run release:major    # 1.1.0 → 2.0.0
```

Before bumping, the script automatically runs `npm run typecheck` and `npm run lint` so a broken build never gets tagged.

You can run these checks individually anytime:

```bash
npm run typecheck
npm run lint
```

Linting uses `eslint-config-expo` (the official Expo flat config).

Flags:

- `-- --skip-checks` — skip the pre-release typecheck
- `-- --no-push` — create the commit and tag locally but don't push
- `-- --no-git` — only edit the version files, skip commit/tag/push entirely

After the tag is pushed, the `release-apk` GitHub Actions job builds the APK and attaches it to the GitHub Release automatically.

---

## Project Structure

```
nyaya-sahayak/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Bottom tab screens (Home, Apply, Map, Emergency)
│   ├── rights/             # Rights detail screen
│   ├── procedure/          # Procedure detail screen
│   ├── category/           # Category screen
│   ├── search.tsx          # Global FTS search
│   ├── settings.tsx        # App settings
│   ├── bookmarks.tsx       # Saved items
│   ├── share.tsx           # Content sharing
│   └── onboarding.tsx      # First-run onboarding
├── components/             # Reusable UI components
├── constants/              # Color tokens
├── context/                # React Context providers
├── data/                   # Static legal content (rights, procedures, offices)
├── hooks/                  # Custom React hooks
└── utils/                  # Helper utilities (search DB, regional cache)
```

---

## Contributing

Nyaya Sahayak is a volunteer-built project. Whether you're an NGO worker, legal aid volunteer, developer, or anyone who believes in equal access to justice — contributions are welcome.

- **Bug reports & feature requests:** Open an issue on GitHub
- **Legal content:** Reach out via email to contribute verified content
- **Code:** Fork the repo and open a pull request

---

## Team

**Ojas S.K Mohbansi** — Founder & Developer  
Driving the technical architecture and vision of Nyaya Sahayak.  
[github.com/ojas-mohbansi](https://github.com/ojas-mohbansi)

**Pranav Prasoon** — Co-Founder & Developer  
Shaping the product experience and legal content strategy.

---

## Disclaimer

Nyaya Sahayak provides general legal information only. It is not a substitute for professional legal advice. Always consult a qualified lawyer for your specific situation.

---

*The law must reach the last person — not just the last mile.*
