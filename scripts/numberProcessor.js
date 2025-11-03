const fs = require('fs');
const path = require('path');

function sumNumbers(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const numbers = content.split('\n').map(Number).filter(n => !isNaN(n));
  return numbers.reduce((acc, n) => acc + n, 0);
}

function findHighest(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const numbers = content.split('\n').map(Number).filter(n => !isNaN(n));
  return Math.max(...numbers);
}

function findLowest(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const numbers = content.split('\n').map(Number).filter(n => !isNaN(n));
  return Math.min(...numbers);
}

function calculateAverage(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const numbers = content.split('\n').map(Number).filter(n => !isNaN(n));
  return numbers.reduce((acc, n) => acc + n, 0) / numbers.length;
}

// EXPORT ALL FUNCTIONS
module.exports = { sumNumbers, findHighest, findLowest, calculateAverage };
