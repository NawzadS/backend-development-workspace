require('dotenv').config();
const express = require('express');
const { sequelize, Track } = require('./database/setup');
const app = express();

app.use(express.json());

// GET all tracks
app.get('/api/tracks', async (req, res) => {
  const tracks = await Track.findAll();
  res.status(200).json(tracks);
});

// GET track by ID
app.get('/api/tracks/:id', async (req, res) => {
  const track = await Track.findByPk(req.params.id);
  if (!track) return res.status(404).json({ message: 'Track not found' });
  res.status(200).json(track);
});

// POST create track
app.post('/api/tracks', async (req, res) => {
  try {
    const required = ['songTitle','artistName','albumName','genre'];
    for (let f of required) {
      if (!req.body[f]) return res.status(400).json({ message: f + ' is required' });
    }
    const track = await Track.create(req.body);
    res.status(201).json(track);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update track
app.put('/api/tracks/:id', async (req, res) => {
  const track = await Track.findByPk(req.params.id);
  if (!track) return res.status(404).json({ message: 'Track not found' });

  try {
    await track.update(req.body);
    res.status(200).json(track);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE track
app.delete('/api/tracks/:id', async (req, res) => {
  const track = await Track.findByPk(req.params.id);
  if (!track) return res.status(404).json({ message: 'Track not found' });

  await track.destroy();
  res.status(200).json({ message: 'Track deleted' });
});

app.listen(3003, () => console.log('🎵 Sequelize Music API running on port 3003'));
