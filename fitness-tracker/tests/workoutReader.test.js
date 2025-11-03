const path = require('path');
const { readWorkoutData } = require('../scripts/workoutReader');

const validFile = path.join(__dirname, '../data/workouts.csv');
const missingFile = path.join(__dirname, '../data/missing.csv');

test('reads valid CSV and returns totals', async () => {
  const { totalWorkouts, totalMinutes } = await readWorkoutData(validFile);
  expect(totalWorkouts).toBeGreaterThan(0);
  expect(totalMinutes).toBeGreaterThan(0);
});

test('throws error for missing CSV', async () => {
  await expect(readWorkoutData(missingFile)).rejects.toThrow();
});
