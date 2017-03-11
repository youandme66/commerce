/*
var pedding = require('pedding');
var app     = require('../../app');
var request = require('supertest')(app);
var support = require('../support/support'); //support断言库自己写
describe('Test/test/user.test.js',function(){
  var testUser;

  before (function (done){
    done = pedding(done,2);
    support.ready(done);
    support.createUser(function(err,user){
      testUser = user;
      done(err);
    });
  });
});

describe('#index',function(){

  it('应该显示用户页',function(done){
    get('/user/'+testUser.loginame)
      .expect(200, function (err, res){
        var texts = [
        ];                                               //用户界面的列表栏
        texts.forEach(function(texts){
          res.text.should.containEql(text);
        });
        done(err);
      });
  });
});

describe('#showSetting',function(){

  it('应该显示设置界面',function(done){
    request.get('/setting')
      .expect(200,function(err){
        if(err) throw err;
        done(err);
      })
  });

  it('应该显示设置成功信息',function(done){
    request.get('/setting').query({save:'success'})
      .expect(200,function(err,res){
        res.text.should.containEql('保存成功。');
        done(err);
      });
  });
});

describe('#setting',function(){
  var userInfo;

  before(function(){
    userInfo={
      url:'http://yyxx.com',
      school:'wuchangshouyi',
      name:support.normalUser.loginname,
      email:support.normalUser.email
    };
  });

  it('应该改变用户信息设置',function(){
    userInfo = _.cloneDeep(userInfo);
    userInfo.action = 'change_setting';
    request.post('/setting').send(userInfo)
      .expect(302,function(err,res){
        res.headers.location.should.equal('/setting?save=success');
        done(err);
      });
  });

  it('应该改变用户密码',function(){
    userInfo = _.cloneDeep(userInfo);
    userInfo.action='change_password';
    userInfo.old_pass = 'password';
    userInfo.new_pass = 'passwordchanged';
    request.post('/setting')
      .send(userInfo).expect(200,function(err,res){
        res.text.should.containEql('密码已修改。');
        done(err);
      });
  });

  it('当旧密码错误时密码不能改变',function(){
    userInfo = _.cloneDeep(userInfo);
    userInfo.action = 'change_pasword';
    userInfo.old_pass = 'wrong_old_pass';
    userInfo.new_pass = 'passwordchanged';
    request.post('/setting')
      .send(userInfo).expect(200,function(err,res){
        res.text.should.containEql('当前密码不正确');
        done(err);
      });
  });
});

describe('#getCollectionGoods',function(){

  it('should get /user/:name/collections ok',function(){
    request.get('/user/'+support.normalUser.loginname)
      .expect(200,function(err,res){
        res.text.should.containEql('收藏的物品');
      });
  });
});

describe('#post_goods',function(){

  it('should get /user/name:/goods ok',function(){
    request.get('/user/'+support.normalUser.loginname)
      .expect(200,function(err,res){
        res.text.should.containEql('发布的物品');
        done(err);
      });
  });
});

describe('#buy_goods',function(){

  it('should get /user/name:/buy/goods ok',function(){
    request.get('/user/'+support.normalUser.loginName)
      .expect(200,function(err,res){
        res.text.should.containEql(support.normalUser.loginname+'购买的物品');
        done(err);
      });
  });

});
*/
