# Tender Document Fill App

A React Native application built with Expo, TypeScript, and Expo Router to help prepare tender documents and quotations.

## Phase 1: handwriting verification

Phase 1 includes the welcome screen, a randomly selected practice phrase, camera permission handling, photo capture, on-device text recognition, and a handwriting result screen. The latest confirmed handwriting sample and recognized text are stored on the device and reused when the app is opened again. Photos and recognized text are not sent to a service.

### Run with Expo

```sh
npm install
npx expo start
```

The on-device OCR module is native and is not available in Expo Go. Build and run a development build on iOS or Android after installing dependencies; the camera requires a physical device for the most reliable results. Browser camera access requires a secure origin or localhost; web does not provide handwriting OCR or persistent sample storage.

Run `npx expo run:ios` or `npx expo run:android` to create and launch a local development build.

The app-specific camera permission message in `app.json` is applied to native development and production builds.

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
  contexts/                Handwriting capture session state
  services/ocr/            On-device OCR provider
  services/storage/        Persistent handwriting sample storage
```

The camera is provided by `expo-camera`. The saved handwriting sample remains on the device; replacing it removes the previous sample.
