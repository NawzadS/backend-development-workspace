const fs = require('fs').promises;

async function readHealthData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    console.log(`Total health entries: ${json.length}`);
    return json.length;
  } catch (err) {
    console.error('❌ Error reading health data:', err.message);
    return 0;
  }
}

module.exports = { readHealthData };
