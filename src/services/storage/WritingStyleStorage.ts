import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import type { HandwritingCapture } from '@/contexts/HandwritingSessionContext';

const imageFileName = 'writing-style.jpg';
const captureFileName = 'writing-style.json';

export async function saveWritingStyle(
  capture: HandwritingCapture,
): Promise<HandwritingCapture> {
  if (Platform.OS === 'web') {
    return capture;
  }

  const imageFile = new File(Paths.document, imageFileName);
  await new File(capture.imageUri).copy(imageFile, { overwrite: true });

  const savedCapture = { ...capture, imageUri: imageFile.uri };
  const captureFile = new File(Paths.document, captureFileName);
  if (!captureFile.exists) {
    captureFile.create();
  }
  captureFile.write(JSON.stringify(savedCapture));

  return savedCapture;
}

export async function loadWritingStyle(): Promise<HandwritingCapture | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const captureFile = new File(Paths.document, captureFileName);
    if (!captureFile.exists) {
      return null;
    }

    const capture: unknown = JSON.parse(await captureFile.text());
    if (
      typeof capture !== 'object' ||
      capture === null ||
      !('imageUri' in capture) ||
      !('expectedText' in capture) ||
      !('detectedText' in capture) ||
      typeof capture.imageUri !== 'string' ||
      typeof capture.expectedText !== 'string' ||
      typeof capture.detectedText !== 'string' ||
      !new File(capture.imageUri).exists
    ) {
      return null;
    }

    return {
      imageUri: capture.imageUri,
      expectedText: capture.expectedText,
      detectedText: capture.detectedText,
    };
  } catch {
    return null;
  }
}
