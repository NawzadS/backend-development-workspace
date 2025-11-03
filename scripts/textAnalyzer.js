const fs = require('fs');

/**
 * Counts total number of words in a text file.
 */
function countWords(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const words = content.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Finds the longest word in a text file.
 */
function findLongestWord(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const words = content.split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return '';
  return words.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  );
}

/**
 * Counts how many lines the file has.
 */
function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

// Optional: verify manually
// console.log(countWords('./data/sample-text.txt'));
// console.log(findLongestWord('./data/sample-text.txt'));
// console.log(countLines('./data/sample-text.txt'));

module.exports = { countWords, findLongestWord, countLines };
