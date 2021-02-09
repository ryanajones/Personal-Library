const { json } = require('body-parser');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

// MongoDB and Mongoose connect
mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, db) => {
    if (err) return console.log(err);
    console.log('Successful database connection.');
  }
);

// Database schema
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [{ type: String }],
});

const Books = mongoose.model('books', bookSchema);

module.exports = function (app) {
  app
    .route('/api/books')

    // Handle GET request to receive JSON response of all documented books
    .get(function (req, res) {
      Books.find({}, (err, booksFound) => {
        if (err) return console.log(err);
        // Make new array of necessary book properties
        const booksResponse = [];
        booksFound.forEach((book) => {
          booksResponse.push({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
          });
        });
        return res.json(booksResponse);
      });
    })

    // Handle POST request to make a new book entry in the library
    .post(function (req, res) {
      const { title } = req.body;

      if (!title) {
        return res.json('missing required field title');
      }

      Books.create({ title: `${title}` }, (err, book) => {
        if (err) return console.log(err);
        return res.json(book);
      });
    })

    // Handle request to delete all books in database
    .delete(function (req, res) {
      Books.deleteMany({}, (err, booksRemoved) => {
        if (err) return console.log(err);
        return res.json('complete delete successful');
      });
    });

  app
    .route('/api/books/:id')

    // Handle GET request for specific book and it's comments using an id
    .get(function (req, res) {
      const bookid = req.params.id;
      Books.findById(bookid, (err, bookFound) => {
        if (err) return console.log(err);
        if (!bookFound) return res.json('no book exists');
        const { _id, title, comments } = bookFound;
        return res.json({
          _id,
          title,
          comments,
        });
      });
    })

    // Handle POST request to find book by ID and update it with
    // a new comment
    .post(function (req, res) {
      const bookid = req.params.id;
      const { comment } = req.body;

      if (!comment)
        return res.json('the string missing required field comment');
      const updateResponse = [];
      Books.findByIdAndUpdate(
        { _id: bookid },
        { $push: { comments: comment } },
        { new: true },
        (err, bookUpdated) => {
          if (err) return console.log(err);
          if (!bookUpdated) return res.json('no book exists');
          const { _id, title, comments } = bookUpdated;
          return res.json({
            _id,
            title,
            comments,
          });
        }
      );
    })

    // Handle request to find book by ID and delete
    .delete(function (req, res) {
      const bookid = req.params.id;
      Books.findByIdAndDelete(bookid, (err, bookDeleted) => {
        if (err) return console.log(err);
        if (!bookDeleted) return res.json('no book exists');
        return res.json('delete successful');
      });
    });
};
