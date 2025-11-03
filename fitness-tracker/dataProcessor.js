require('dotenv').config();
const path = require('path');
const { readHealthData } = require('./scripts/healthReader');
const { readWorkoutData } = require('./scripts/workoutReader');

async function processFiles() {
  try {
    const user = process.env.USER_NAME;
    const goal = Number(process.env.WEEKLY_GOAL);

    console.log(`Processing data for: ${user}`);
    console.log('📁 Reading workout data...');
    const workoutPath = path.join(__dirname, 'data/workouts.csv');
    const { totalWorkouts, totalMinutes } = await readWorkoutData(workoutPath);

    console.log('📁 Reading health data...');
    const healthPath = path.join(__dirname, 'data/health-data.json');
    const totalHealthEntries = await readHealthData(healthPath);

    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${totalWorkouts}`);
    console.log(`Total workout minutes: ${totalMinutes}`);
    console.log(`Health entries found: ${totalHealthEntries}`);
    console.log(`Weekly goal: ${goal} minutes`);

    if (totalMinutes >= goal) {
      console.log(`🎉 Congratulations ${user}! You have met or exceeded your weekly goal!`);
    } else {
      console.log(`⚠️ ${user}, you need ${goal - totalMinutes} more minutes to reach your weekly goal.`);
    }
  } catch (err) {
    console.error('Error processing files:', err.message);
  }
}

processFiles();
