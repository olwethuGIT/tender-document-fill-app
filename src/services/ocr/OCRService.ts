import { PlaceholderOCRProvider } from './PlaceholderOCRProvider';
import type { OCRProvider } from './OCRProvider';

export class OCRService {
  constructor(private readonly provider: OCRProvider) {}

  recognizeHandwriting(imageUri: string): Promise<string> {
    return this.provider.recognizeHandwriting(imageUri);
  }
}

export const ocrService = new OCRService(new PlaceholderOCRProvider());
