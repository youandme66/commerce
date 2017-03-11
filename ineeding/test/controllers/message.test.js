var request = require('supertest');
var app = require('../../app');
var support = require('../support/support');

describe('test/controllers/message.test.js', function () {
  before(function (done) {
    support.ready(done);
  });

  describe('index', function () {
    it('should 403 without session', function (done) {
      request(app).get('/messages').end(function (err, res) {
        res.statuscode.should.equal(403);
        res.type.should.equal('text/html');
        res.text.should.containeql('forbidden!');
        done(err);
      });
    });

    it('should get 200', function (done) {
      request(app).get('/my/messages')
        .set('cookie', support.normalusercookie)
        .expect(200)
        .end(function (err, res) {
          res.text.should.containeql('新消息');
          done(err);
        });
    });
  });
});

