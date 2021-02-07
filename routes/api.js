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

// Database schemas
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [{ comment: String }],
});

const Books = mongoose.model('books', bookSchema);

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const booksResponse = [];
      const fieldsToFilter = {
        _id: 'hello',
        title: 'test',
        comments: 'tester',
      };
      const test = {
        _id: '601d4ce94a028f646f9fa5a9',
        title: 'hello',
        comments: [],
        __v: 0,
      };
      Books.find({}, (err, booksFound) => {
        // console.log(booksFound[0]._id);
        if (err) return console.log(err);
        Object.keys(fieldsToFilter).forEach((key, index) => {
          console.log(key);
          /* booksResponse = booksResponse.filter(
            (field) => field[key] == fieldsToFilter[key]
          ); */
        });
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
