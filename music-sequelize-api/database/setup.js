require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, process.env.DB_NAME)
});

const Track = sequelize.define('Track', {
  trackId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  songTitle: { type: DataTypes.STRING, allowNull: false },
  artistName: { type: DataTypes.STRING, allowNull: false },
  albumName: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER },
  releaseYear: { type: DataTypes.INTEGER }
});

async function setup() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');
    await sequelize.sync({ force: true });
    console.log('Tables synced.');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

setup();

module.exports = { sequelize, Track };
