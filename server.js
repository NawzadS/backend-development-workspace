require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Project, Task } = require('./database/setup');

const app = express();
app.use(express.json());
app.use(cors());

// simple logger
app.use((req, res, next) => {
  console.log(\[\] \ \\, req.body || {});
  next();
});

// helper to generate JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
}

// JWT auth middleware
function authRequired(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verify error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// role-based middleware
function requireManager(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role === 'manager' || req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: manager or admin only' });
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: admin only' });
}

// REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const allowedRoles = ['employee', 'manager', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'employee';

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, role: userRole });

    const token = generateToken(user);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN
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

    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// LOGOUT (stateless JWT) – just confirm, nothing to destroy
app.post('/api/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful (client should discard token)' });
});

// EMPLOYEE / MANAGER / ADMIN: basic projects GET
app.get('/api/projects', authRequired, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'employee') {
      projects = await Project.findAll({
        where: { userId: req.user.id },
        include: [{ model: Task }]
      });
    } else {
      projects = await Project.findAll({ include: [{ model: Task }] });
    }
    res.status(200).json(projects);
  } catch (err) {
    console.error('Projects error:', err.message);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// MANAGER OR ADMIN: create project
app.post('/api/projects', authRequired, requireManager, async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    const ownerId = userId || req.user.id;
    const project = await Project.create({ name, description: description || '', userId: ownerId });
    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err.message);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// MANAGER OR ADMIN: update project
app.put('/api/projects/:id', authRequired, requireManager, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await project.update(req.body);
    res.status(200).json(project);
  } catch (err) {
    console.error('Update project error:', err.message);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// MANAGER OR ADMIN: create task under project
app.post('/api/projects/:id/tasks', authRequired, requireManager, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title is required' });

    const task = await Task.create({ title, completed: false, projectId: project.id });
    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err.message);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// MANAGER OR ADMIN: delete task
app.delete('/api/tasks/:id', authRequired, requireManager, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.destroy();
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err.message);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// ADMIN ONLY: view all users
app.get('/api/users', authRequired, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role']
    });
    res.status(200).json(users);
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ADMIN ONLY: delete project
app.delete('/api/projects/:id', authRequired, requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Task.destroy({ where: { projectId: project.id } });
    await project.destroy();
    res.status(200).json({ message: 'Project and its tasks deleted' });
  } catch (err) {
    console.error('Delete project error:', err.message);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\? JWT + Roles Task API running on port \\);
});
