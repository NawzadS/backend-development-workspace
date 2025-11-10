const express = require('express');
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "Dune", author: "Frank Herbert", year: 1965 },
  { id: 2, title: "Dune Messiah", author: "Frank Herbert", year: 1969 },
  { id: 3, title: "Children of Dune", author: "Frank Herbert", year: 1976 }
];

app.get('/api/books', (req, res) => { res.json(books); });

app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;
  const newBook = { id: books.length + 1, title, author, year };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  const { title, author, year } = req.body;
  book.title = title ?? book.title;
  book.author = author ?? book.author;
  book.year = year ?? book.year;
  res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ message: "Book not found" });
  books.splice(index, 1);
  res.sendStatus(204);
});

const PORT = 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}



module.exports = app;
