/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');

const { assert } = chai;
const server = require('../server');

chai.use(chaiHttp);

let id;
const fakeID = '6023a2ca30605d1e4b61efd5';

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: 'Book Title Test' })
            .end(function (err, res) {
              if (err) {
                console.log(err);
                return done(err);
              }
              id = res.body._id;
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'Book Title Test');
              assert.isObject(res.body, 'response should be an object');
              assert.property(
                res.body,
                '_id',
                'Book object should contain _id'
              );
              assert.property(
                res.body,
                'title',
                'Book object should contain title'
              );
              assert.property(
                res.body,
                'comments',
                'Books object should contain comments'
              );
              done();
            });
        });

        test('Test POST /api/books with no title given', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: '' })
            .end(function (err, res) {
              if (err) {
                console.log(err);
                return done(err);
              }
              assert.equal(res.status, 200);
              assert.equal(res.body, 'missing required field title');
              done();
            });
        });
      }
    );

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(
              res.body[0],
              '_id',
              'Books in array should contain _id'
            );
            assert.property(
              res.body[0],
              'title',
              'Books in array should contain title'
            );
            assert.property(
              res.body[0],
              'commentcount',
              'Books in array should contain commentcount'
            );
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${fakeID}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'Book object should contain _id');
            assert.property(
              res.body,
              'title',
              'Book object should contain title'
            );
            assert.property(
              res.body,
              'comments',
              'Books object should contain comments'
            );
            done();
          });
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          chai
            .request(server)
            .post(`/api/books/${id}`)
            .send({ comment: 'This is a test comment' })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(
                res.body,
                '_id',
                'Book object should contain _id'
              );
              assert.property(
                res.body,
                'title',
                'Book object should contain title'
              );
              assert.property(
                res.body,
                'comments',
                'Books object should contain comments'
              );
              assert.equal(res.body.comments[0], 'This is a test comment');
              done();
            });
        });

        test('Test POST /api/books/[id] without comment field', function (done) {
          chai
            .request(server)
            .post(`/api/books/${id}`)
            .send({ comment: '' })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'missing required field comment');
              done();
            });
        });

        test('Test POST /api/books/[id] with comment, id not in db', function (done) {
          chai
            .request(server)
            .post(`/api/books/${fakeID}`)
            .send({ comment: 'This is a test comment' })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
            });
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${fakeID}`)
          .end(function (err, res) {
            console.log(res.body);
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
    });
  });
});
