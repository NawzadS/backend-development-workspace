const path = require('path');
const { sumNumbers, findHighest, findLowest, calculateAverage } = require('../scripts/numberProcessor');

const sampleNumbersPath = path.join(__dirname, '../data/sample-numbers.txt');

test('calculates sum of numbers', () => {
  const result = sumNumbers(sampleNumbersPath);
  expect(result).toBeGreaterThan(0);
});

test('finds highest number', () => {
  const result = findHighest(sampleNumbersPath);
  expect(result).toBeGreaterThan(0);
});

test('finds lowest number', () => {
  const result = findLowest(sampleNumbersPath);
  expect(result).toBeLessThanOrEqual(findHighest(sampleNumbersPath));
});

test('calculates average', () => {
  const result = calculateAverage(sampleNumbersPath);
  expect(result).toBeGreaterThan(0);
});
