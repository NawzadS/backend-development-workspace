const path = require('path');
const { countWords, findLongestWord, countLines } = require('../scripts/textAnalyzer');

const sampleTextPath = path.join(__dirname, '../data/sample-text.txt');

test('counts total words', () => {
  const result = countWords(sampleTextPath);
  expect(result).toBeGreaterThan(0);
});

test('finds longest word', () => {
  const result = findLongestWord(sampleTextPath);
  expect(result.length).toBeGreaterThan(0);
});

test('counts lines', () => {
  const result = countLines(sampleTextPath);
  expect(result).toBeGreaterThan(0);
});
