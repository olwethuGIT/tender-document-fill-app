import { Platform } from 'react-native';

import type { OCRProvider } from './OCRProvider';

type MlkitOcrModule = typeof import('expo-mlkit-ocr');

// expo-mlkit-ocr's native module is only available in a custom dev build
// (it is not bundled with Expo Go), so loading it eagerly can crash the app
// with "Cannot find native module 'ExpoMlkitOcr'". Load it lazily and
// tolerate the failure so the rest of the app keeps working without OCR.
let mlkitOcr: MlkitOcrModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  mlkitOcr = require('expo-mlkit-ocr') as MlkitOcrModule;
} catch {
  mlkitOcr = null;
}

export class MLKitOCRProvider implements OCRProvider {
  async recognizeHandwriting(imageUri: string): Promise<string> {
    if (Platform.OS === 'web' || !mlkitOcr) {
      return '';
    }

    try {
      if (!mlkitOcr.isSupported()) {
        return '';
      }

      const result = await mlkitOcr.recognizeText(imageUri);
      return result.text;
    } catch {
      return '';
    }
  }
}
