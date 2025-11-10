const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

let menu = [
  { id: 1, name: "Cheeseburger", description: "Juicy grilled burger with cheese", price: 9.99, category: "entree", ingredients: ["beef", "cheese", "bun"], available: true }
];

// Logging middleware
app.use((req, res, next) => {
  const t = new Date().toISOString();
  console.log([]  , req.body);
  next();
});

// Validation rules
const validate = [
  body('name').isString().isLength({ min: 3 }),
  body('description').isString().isLength({ min: 10 }),
  body('price').isFloat({ gt: 0 }),
  body('category').isIn(["appetizer", "entree", "dessert", "beverage"]),
  body('ingredients').isArray({ min: 1 })
];

// Routes (CRUD)
app.get('/api/menu', (req, res) => res.status(200).json(menu));

app.get('/api/menu/:id', (req, res) => {
  const item = menu.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Menu item not found" });
  res.status(200).json(item);
});

app.post('/api/menu', validate, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const newItem = { id: menu.length + 1, ...req.body, available: req.body.available ?? true };
  menu.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/menu/:id', validate, (req, res) => {
  const item = menu.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: "Menu item not found" });
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  Object.assign(item, req.body);
  res.status(200).json(item);
});

app.delete('/api/menu/:id', (req, res) => {
  const index = menu.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Menu item not found" });
  menu.splice(index, 1);
  res.status(200).json({ message: "Menu item deleted" });
});

if (require.main === module) {
  app.listen(3000, () => console.log("✅ Tasty Bites API running on port 3000"));
}

module.exports = app;
