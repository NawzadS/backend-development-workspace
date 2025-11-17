const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// tiny logger
app.use((req,res,next)=>{
  console.log(\[\] \ \\, req.body || {});
  next();
});

const db = new sqlite3.Database(path.join(__dirname, 'database', 'university.db'));

// GET all courses
app.get('/api/courses', (req,res)=>{
  db.all('SELECT * FROM courses', [], (err, rows)=>{
    if (err) return res.status(500).json({error: err.message});
    res.status(200).json(rows);
  });
});

// GET course by ID
app.get('/api/courses/:id', (req,res)=>{
  db.get('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, row)=>{
    if (err) return res.status(500).json({error: err.message});
    if (!row) return res.status(404).json({message:'Course not found'});
    res.status(200).json(row);
  });
});

// POST create course
app.post('/api/courses', (req,res)=>{
  const { courseCode, title, credits, description, semester } = req.body;
  if (!courseCode || !title || !credits || !description || !semester) {
    return res.status(400).json({message:'Missing required fields'});
  }
  const sql = 'INSERT INTO courses (courseCode, title, credits, description, semester) VALUES (?,?,?,?,?)';
  const params = [courseCode, title, credits, description, semester];
  db.run(sql, params, function(err){
    if (err) return res.status(400).json({error: err.message});
    db.get('SELECT * FROM courses WHERE id = ?', [this.lastID], (e, row)=>{
      if (e) return res.status(500).json({error: e.message});
      res.status(201).json(row);
    });
  });
});

// PUT update course
app.put('/api/courses/:id', (req,res)=>{
  const { courseCode, title, credits, description, semester } = req.body;
  const sql = 
    UPDATE courses
      SET courseCode = COALESCE(?, courseCode),
          title      = COALESCE(?, title),
          credits    = COALESCE(?, credits),
          description= COALESCE(?, description),
          semester   = COALESCE(?, semester)
    WHERE id = ?;
  const params = [courseCode, title, credits, description, semester, req.params.id];
  db.run(sql, params, function(err){
    if (err) return res.status(400).json({error: err.message});
    if (this.changes === 0) return res.status(404).json({message:'Course not found'});
    db.get('SELECT * FROM courses WHERE id = ?', [req.params.id], (e,row)=>{
      if (e) return res.status(500).json({error: e.message});
      res.status(200).json(row);
    });
  });
});

// DELETE course
app.delete('/api/courses/:id', (req,res)=>{
  db.run('DELETE FROM courses WHERE id = ?', [req.params.id], function(err){
    if (err) return res.status(500).json({error: err.message});
    if (this.changes === 0) return res.status(404).json({message:'Course not found'});
    res.status(200).json({message:'Course deleted'});
  });
});

const PORT = 3002; // different port so it won’t clash with your other servers
if (require.main === module) {
  app.listen(PORT, ()=>console.log(\✅ Courses API running on port \\));
}
module.exports = app;
