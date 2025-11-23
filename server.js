require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { sequelize, User, Project, Task } = require('./database/setup');

const app = express();

app.use(express.json());

// session middleware
app.use(session({
  secret: 'super-secret-session-key', // fine for class assignment
  resave: false,
  saveUninitialized: false
}));

// tiny logger
app.use((req, res, next) => {
  console.log(\[\] \ \\, req.body || {});
  next();
});

// auth middleware
function authRequired(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
}

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/logout
app.post('/api/logout', (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: 'Logged out' });
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err.message);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

// PROTECTED: GET /api/projects
app.get('/api/projects', authRequired, async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.session.userId },
      include: [{ model: Task }]
    });
    res.status(200).json(projects);
  } catch (err) {
    console.error('Projects error:', err.message);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Optionally, you can also protect other routes (POST/PUT/DELETE for projects/tasks)
// and filter by req.session.userId, but the assignment only requires at least one protected route.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\✅ Auth-enabled Task API running on port \\);
});
