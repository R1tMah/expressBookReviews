// ----------  📁 general.js  ----------

const express = require("express");
let books   = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;   // tells if a username already exists
let users   = require("./auth_users.js").users;     // in-memory users array
const public_users = express.Router();

/* ---------- Task 6 – Register a new user ---------- */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Username must be unique
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. You may now log in." });
});

/* ---------- Task 1 – List all books ---------- */
public_users.get("/", (req, res) => {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

/* ---------- Task 2 – Get book by ISBN ---------- */
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });
  }
  return res.status(200).send(JSON.stringify({ isbn, ...book }, null, 4));
});

/* ---------- Task 3 – Get books by author ---------- */
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const matches = Object.keys(books)
    .filter(id => books[id].author === author)
    .map(id => ({ isbn: id, ...books[id] }));

  if (matches.length === 0) {
    return res.status(404).json({ message: `No books found by author ${author}` });
  }
  return res.status(200).send(JSON.stringify(matches, null, 4));
});

/* ---------- Task 4 – Get books by title ---------- */
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const matches = Object.keys(books)
    .filter(id => books[id].title === title)
    .map(id => ({ isbn: id, ...books[id] }));

  if (matches.length === 0) {
    return res.status(404).json({ message: `No books found with title "${title}"` });
  }
  return res.status(200).send(JSON.stringify(matches, null, 4));
});

/* ---------- Task 5 – Get reviews for a book ---------- */
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}` });
  }
  return res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
