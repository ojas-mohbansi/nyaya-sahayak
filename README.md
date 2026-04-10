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
- pnpm 10+
- Expo Go app on your phone (for device testing)

### Install

```bash
git clone https://github.com/ojas-mohbansi/nyaya-sahayak.git
cd nyaya-sahayak
pnpm install
```

### Run in Development

```bash
pnpm run dev
```

This starts the Expo development server. You can then:
- Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS) to run on your device
- Press `w` to open in a web browser

### Type Check

```bash
pnpm run typecheck
```

---

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for creating production binaries. You will need an [Expo account](https://expo.dev) and the EAS CLI installed.

```bash
npm install -g eas-cli
eas login
```

### Android (APK / AAB)

```bash
eas build --platform android
```

### iOS (IPA)

```bash
eas build --platform ios
```

> iOS builds require an Apple Developer account.

See `.github/workflows/build.yml` for the automated CI/CD pipeline.

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
