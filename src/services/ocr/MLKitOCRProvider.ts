import { isSupported, recognizeText } from 'expo-mlkit-ocr';
import { Platform } from 'react-native';

import type { OCRProvider } from './OCRProvider';

export class MLKitOCRProvider implements OCRProvider {
  async recognizeHandwriting(imageUri: string): Promise<string> {
    if (Platform.OS === 'web' || !isSupported()) {
      return '';
    }

    const result = await recognizeText(imageUri);
    return result.text;
  }
}
