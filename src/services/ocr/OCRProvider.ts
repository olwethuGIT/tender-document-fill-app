export interface OCRProvider {
  recognizeHandwriting(imageUri: string): Promise<string>;
}
