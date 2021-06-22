const express = require('express')
const app = express()
const sqlite = require('sqlite3')
const util = require('util')

app.use(express.json())
const db = new sqlite.Database('./bookshelf.sqlite')
db.all = util.promisify(db.all)

app.get('/rest/hello', (req, res)=> {
  res.json({
    message:'Hello World!'
  })
})

app.get('/rest/books', async (req, res) => {
  let books = await db.all('SELECT * FROM books')

  res.json({
    books
  })
})

app.get('/rest/authors', async (req, res) => {
  let authors = await db.all('SELECT * FROM authors')

  res.json({
    authors
  })
})

app.get('/rest/genres', async (req, res) => {
  let genres = await db.all('SELECT * FROM genres')

  res.json({
    genres
  })
})

app.get('/rest/book_authors', async (req, res) => {

  
 let title = req.query.title

  let authors = await db.all("SELECT a.* FROM authors a JOIN authors_books ab ON a.id = ab.author_id JOIN books b ON b.id = ab.book_id WHERE b.title LIKE '%" + title + "%'")

  console.log(authors)
  res.json({
    book_authors: authors
  })
})

app.get('/rest/author_books', async (req, res) => {

  
 let author = req.query.author

  let books = await db.all("SELECT b.* FROM books b JOIN authors_books ab ON b.id = ab.book_id JOIN authors a ON a.id = ab.author_id WHERE a.name LIKE '%" + author + "%'")

  console.log(books)
  res.json({
    author_books: books
  })
})

app.get('/rest/book_genres', async (req, res) => {

  
 let title = req.query.title

  let genres = await db.all("SELECT g.* FROM genres g JOIN books_genres bg ON g.id = bg.genre_id JOIN books b ON b.id = bg.book_id WHERE b.title LIKE '%" + title + "%'")

  console.log(genres)
  res.json({
    book_genres: genres
  })
})

app.get("/rest/books/:id", async (req, res) => {

  let book = await db.all('SELECT * FROM books WHERE id = $id', {
    $id: req.params.id
  })

  res.json({
    book,
  });
});

app.get("/rest/authors/:id", async (req, res) => {

  let author = await db.all('SELECT * FROM authors WHERE id = $id', {
    $id: req.params.id
  })

  res.json({
    author,
  });
});

app.get("/rest/genres/:id", async (req, res) => {

  let genre = await db.all('SELECT * FROM genres WHERE id = $id', {
    $id: req.params.id
  })

  res.json({
    genre,
  });
});



app.listen(5000, ()=> {
  console.log('Listening on port 5000')
})