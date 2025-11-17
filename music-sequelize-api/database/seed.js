require('dotenv').config();
const { sequelize, Track } = require('./setup');

async function seed() {
  try {
    await sequelize.authenticate();

    await Track.bulkCreate([
      { songTitle: 'Blinding Lights', artistName: 'The Weeknd', albumName: 'After Hours', genre: 'Pop', duration: 200, releaseYear: 2020 },
      { songTitle: 'Shape of You', artistName: 'Ed Sheeran', albumName: 'Divide', genre: 'Pop', duration: 233, releaseYear: 2017 },
      { songTitle: 'Lose Yourself', artistName: 'Eminem', albumName: '8 Mile', genre: 'Hip-Hop', duration: 326, releaseYear: 2002 },
      { songTitle: 'Billie Jean', artistName: 'Michael Jackson', albumName: 'Thriller', genre: 'Pop', duration: 294, releaseYear: 1982 },
    ]);

    console.log('Seeded tracks.');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

seed();
