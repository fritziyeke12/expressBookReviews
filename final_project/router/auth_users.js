const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "user1", password: "passw"}];

const isValid = (username)=>{

  //code
  let filtered_users = users.filter((user) => user.username === username);
  if(filtered_users.length > 0){
    return true;
  }
  else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{

  //code
  let filtered_users = users.filter((user) => user.username === username && user.password === password);
  if(filtered_users.length > 0){
    return true;
  }
  else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  //code
  const { username, password } = req.body;

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: {username, password}
    }, "access", { expiresIn: 60 * 10});

    req.session.authorization = { accessToken, username }
    return res.status(200).send("User logged in!");
  }
  else{
    return res.status(401).send("Invalid login!");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  //code
  const { isbn } = req.params;
  const { review } = req.query;

  if(!review){
    console.log(req.user.data.username);
    res.status(400).send("No review submitted!");
    return;
  }

  // res.send("Test");
  books[isbn].reviews[req.user.data.username] = review;
  res.status(202).send(books[isbn].reviews)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  //code
  const { isbn } = req.params;
  const user = req.user.data.username;

  loggedBooks = Object.keys(books);

  if(!loggedBooks.includes(isbn)){
    res.status(404).send("Book not found in database!");
    return;
  }

  let bookReviews = books[isbn].reviews;

  if(!bookReviews[user]){
    res.status(400).send("This user has no reviews to delete!")
    return;
  }

  let temp = bookReviews[user];
  delete bookReviews[user];

  res.status(202).send(`Deleted review by ${user}: "${temp}"`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
