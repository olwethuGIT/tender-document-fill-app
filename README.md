# Tender Document Fill App

A React Native application built with Expo, TypeScript, and Expo Router to help prepare tender documents and quotations.

## Phase 1: handwriting verification

Phase 1 includes the welcome screen, a randomly selected practice phrase, camera permission handling, photo capture, and a handwriting result screen. OCR is intentionally a placeholder: captured photos are not sent to a service, and detected text can be entered manually for this phase.

### Run with Expo

```sh
npm install
npx expo start
```

Open the QR code with Expo Go on an iOS or Android device. Use `npx expo start --ios` or `npx expo start --android` when running on a simulator or emulator. The camera requires a physical device in Expo Go; browser camera access requires a secure origin or localhost.

`expo-camera` works in Expo Go. The app-specific camera permission message in `app.json` is applied to native development and production builds; Expo Go uses its own permission message.

Check TypeScript with:

```sh
npm run typecheck
```

## Project structure

```text
src/
  app/                    Expo Router screens
  components/             Reusable buttons, cards, and screen layout
  constants/               Theme and handwriting phrases
  contexts/                In-memory handwriting capture state
  services/ocr/            Replaceable OCR provider and placeholder
```

The camera is provided by `expo-camera` and is supported in Expo Go. A production OCR provider will be added in a later phase; cloud OCR will require a server-side integration and must not expose credentials in the app.
