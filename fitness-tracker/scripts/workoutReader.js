const fs = require('fs');
const csv = require('csv-parser');

function readWorkoutData(filePath) {
  return new Promise((resolve, reject) => {
    const workouts = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => workouts.push(row))
      .on('end', () => {
        const totalWorkouts = workouts.length;
        const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.minutes || 0), 0);
        console.log(`Total workouts: ${totalWorkouts}`);
        console.log(`Total minutes: ${totalMinutes}`);
        resolve({ totalWorkouts, totalMinutes });
      })
      .on('error', (err) => {
        console.error('❌ Error reading workout CSV:', err.message);
        reject(err);
      });
  });
}

module.exports = { readWorkoutData };
