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
  comments: [{ comment: String }],
});

const Books = mongoose.model('books', bookSchema);

module.exports = function (app) {
  app
    .route('/api/books')

    // Handle GET request to receive JSON response of an documented books
    // stored in the personal library. Response will have id, title, and
    // number of comments in the comments array.
    .get(function (req, res) {
      const booksResponse = [];
      const fieldsToFilter = ['_id', 'title', 'comments'];
      Books.find({}, (err, booksFound) => {
        if (err) return console.log(err);
        booksFound.forEach((book) => {
          booksResponse.push({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
          });
        });
        res.json(booksResponse);
      });
    })

    .post(function (req, res) {
      const { title } = req.body;
      // response will contain new book object including atleast _id and title

      if (!title) {
        return res.json('missing required field title');
      }

      Books.create({ title: `${title}` }, (err, book) => {
        if (err) return console.log(err);
        return res.json(book);
      });
    })

    .delete(function (req, res) {
      // if successful response will be 'complete delete successful'
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      const bookid = req.params.id;
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      const bookid = req.params.id;
      const { comment } = req.body;
      // json res format same as .get
    })

    .delete(function (req, res) {
      const bookid = req.params.id;
      // if successful response will be 'delete successful'
    });
};
