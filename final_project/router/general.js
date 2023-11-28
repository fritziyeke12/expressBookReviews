const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  //code
  const { username, password } = req.body;

  if(!username || !password){
    res.status(400).send("No username or password provided");
    return;
  }

  // let takenUsernames = [];

  // for(index in users){
  //   takenUsernames.push(users[index].username);
  // }

  // if(takenUsernames.includes(username)){
  //   res.status(409).send("Username is in use");
  //   return;
  // }

  if(isValid(username)){
    res.status(409).send("Username already in use");
    return;
  }

  users.push({
    username: username,
    password: password
  });

  res.status(201).send(`User registered!\nUsername: ${username}\npassword: ${password}`)
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {

  //Write your code here

  let allBooks = await books;

  return res.status(200).send(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {

  //code
  const isbn = req.params.isbn;

  let allBooks = await books;

  res.status(200).send(allBooks[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {

  //code
  const author = req.params.author;

  let allBooks = await books;

  for (index in allBooks){
    if(allBooks[index].author === author){
      res.status(200).send(allBooks[index])
      return;
    }
  }

  res.status(404).send(`No book written by author ${author} found!`);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {

  //code
  const title = req.params.title;

  let allBooks = await books;

  for (index in allBooks){
    if(allBooks[index].title === title){
      res.status(200).send(allBooks[index])
      return;
    }
  }

  res.status(404).send(`No book written by title ${title} found!`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  //code
  const ISBN = req.params.isbn;

  res.status(200).send(books[ISBN].reviews)
});

module.exports.general = public_users;
