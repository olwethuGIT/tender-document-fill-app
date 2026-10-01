import type { OCRProvider } from './OCRProvider';

export class PlaceholderOCRProvider implements OCRProvider {
  async recognizeHandwriting(_imageUri: string): Promise<string> {
    return '';
  }
}
