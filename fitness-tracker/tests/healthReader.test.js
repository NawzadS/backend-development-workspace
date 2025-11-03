const path = require('path');
const { readHealthData } = require('../scripts/healthReader');

const validFile = path.join(__dirname, '../data/health-data.json');
const missingFile = path.join(__dirname, '../data/missing.json');

test('reads valid health JSON and returns entry count', async () => {
  const count = await readHealthData(validFile);
  expect(count).toBeGreaterThan(0);
});

test('returns 0 for missing file', async () => {
  const count = await readHealthData(missingFile);
  expect(count).toBe(0);
});
