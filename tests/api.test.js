const request = require('supertest');
const app = require('../server.js');

describe("Books API", () => {

  it("GET /api/books returns all books", async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/books/:id returns one book", async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title");
  });

  it("POST /api/books creates a new book", async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: "New Test Book", author: "Tester", year: 2025 });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("New Test Book");
  });

});
