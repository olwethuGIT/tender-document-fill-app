export const practicePhrases = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'Sphinx of black quartz, judge my vow.',
  'A journey of a thousand miles begins with a single step.',
];

export function getRandomPracticePhrase(): string {
  const index = Math.floor(Math.random() * practicePhrases.length);
  return practicePhrases[index] ?? practicePhrases[0];
}
