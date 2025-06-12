// ----------  📁 auth_users.js  ----------
const express = require("express");
const jwt     = require("jsonwebtoken");
let books     = require("./booksdb.js");

const regd_users = express.Router();
let users = [];                // populated by /register in general.js

/* Helper ──────────────────────────────────────────── */
const isValid = username => users.some(u => u.username === username);

const authenticatedUser = (username, password) =>
  users.some(u => u.username === username && u.password === password);

/* ---------- Task 7 – Login (POST /customer/login) ---------- */
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 1) sanity check
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // 2) credentials OK?
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // 3) sign JWT and stash it in the session (index.js middleware will look here)
  const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "Login successful." });
});

/* ---------- Task 8 – Add / modify a book review ---------- */
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn   = req.params.isbn;
  const review = req.query.review;                    // sent as ?review=…
  const user   = req.session.authorization?.username;

  if (!review) {
    return res.status(400).json({ message: "Review text missing in query string." });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}.` });
  }

  // add or overwrite the caller’s review
  books[isbn].reviews[user] = review;
  return res.status(200).json({ message: "Review added / updated successfully." });
});

/* ---------- Task 9 – Delete a book review ---------- */
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: `No book found with ISBN ${isbn}.` });
  }

  if (!books[isbn].reviews[user]) {
    return res.status(404).json({ message: "You have no review to delete for this book." });
  }

  delete books[isbn].reviews[user];
  return res.status(200).json({ message: "Your review was deleted." });
});

/* ─────────────────────────────────────────────────── */
module.exports.authenticated = regd_users;
module.exports.isValid       = isValid;
module.exports.users         = users;
