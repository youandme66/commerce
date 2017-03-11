var app     = require('../app');
var request = require('supertest');
var should  = require('should');

describe('test/app.test.js', function () {
  it('should get status 200 and show home page', function () {
    request(app).get('/')
      .expect(200)
      .end(function(err, res){
        if(err){
          throw err;
        }
        res.text.should.containEql('注册');
        res.text.should.containEql('INeeding');
      });
  });

});
