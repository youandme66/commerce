var should  = require('should');
var request = require('supertest');
var mm      = require('mm');
var app     = require('../../app');

describe('controllers/signup',function(){
  function getRandom(length){
    var Num = "";
    for(;Num.length!==Num.length-1;){
      for(var i=0;i<length;i++){
        Num += Math.floor(Math.random(Math.random())*10);
        Num = Num.toString();
      }
      return Num;
    }
  }

  var pass = 'greyhound' + Math.floor(Math.random()*1000);
  var login_name = 'greyhound'+getRandom(6);
  var phone_number = getRandom(11);

  describe('sign up', function (done) {
    it('should sign up a user', function (done) {
      var user = {
        phone_number:phone_number,
        login_name:login_name,
        pass:pass,
        rePass:pass,
      }

      request(app).post('/signup')
        .send(user)
        .expect(200, function (err, res) {
          res.text.should.containEql('注册成功');
          done(err);
        });

    });

    it('should redirect to home page', function(done){
      request(app)
        .get('/signup')
        .end('')
      done(err);
    });

  });

});
