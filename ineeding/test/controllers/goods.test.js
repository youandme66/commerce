/*
var app = require('../../app');
var supertest = require('supertest');
var request = supertest(app);
var support = require('../support/support');
var should = require('should');

describe('Test/test/goods.test.js',function(){
  var mockUser,mockGoods;

  before(function(done){
    support.createUser(function(err,user){
      mockUser = user;
      support.createGoods(user.id,function(err,goods){
        mockGoods = goods;
        done();
      });
    });
  });

  describe('get test/goods/:goodsid',function(){

    it('应该得到物品的信息',function(done){
      request.get('test/goods'+mockGoods.id)
        .end( function (err, res){
          should.not.exists(err);
          res.body.data.id.should.equal(mockGoods.id);
          done();
        })
    })
  })

  describe('post test/goods',function(){
    it('应该创建一个物品',function(done){
      request.post('test/goods')
        .send({
          accesstoken: mockUser.accessToken,
          price:10,
          title:'这是个电脑',
          description:'这个电脑已经用了一年'
        })
      .end(function(err,res){
        should.not.exists(err);
        res.body.success.should.true();
        res.body.goods_id.should.be.String();
        done();
      })
    })
  })

  describe('post test/goods/collect',function(){

    it('应该收集某个用户的物品',function(done){
      request.post('test/goods/collect')
        .send({
          accesstoken:mockUser.accessToken,
          goods_id:mockGoods.id
        })
      .end(function(err,res){
        should.not.exists(err);
        res.body.should.equal({'success':true});
        done();
      });
    })

    it('当物品没有找到时不能做任何事',function(done){
      request.post('test/goods/collect')
        .send({
          accesstoken:support.normalUser.accessToken,
          goods_id:mockGoods.id+'not_fund'
        })
      .end(function(err,res){
        should.not.exists(err);
        res.status.should.equal(500);
        done();
      })
    })
  })

  describe('#create',function(){

    it('应该显示一个创建的页面',function(done){
      request.get('/goods/create')
        .set('Cookie', support.normalUserCookie)
        .expect(200,function(err,res){
          res.text.should.containEql('发布物品');
          done(err);
        });
    });
  });

  describe('#put',function(){

    it('当标题为空时不能创建',function(){
      resquest.post('/goods/create')
        .send({
          title:'',
          kind:'学习',
          content:'1111'
        })
      .set('Cookie',support.normalUserCoookie)
        .expect(422,function(err,res){
          res.text.should.containEql('标题不能为空');
          done(err);
        });
    });

    it('当没有种类时不能创建',function(){
      request.post('/goods/create')
        .send({
          tilte:'',
          kind:'学习',
          content:'1111'
        })
      .set('Cookie',support.normalUserCookie)
        .expect(422,function(err,res){
          res.text.should.containEql('种类不能为空');
          done(err)
        });
    });

    it('当没有正文时不能创建',function(){
      request.post('/goods/create')
        send({
          title:'',
          kind:'学习',
          content:'1111'
        })
      set('Cookie',support.normalUserCookie)
        .expect('422',function(err,res){
          res.text.should.containEql('正文不能为空');
          done(err)
        });
    });
  })

  describe('#update',function(){

    it('应该更新一个物品',function(done){
      request.post('/goods/'+support.testGoods._id+'/edit')
        .send({
          title:'修改后的物品标题',
          kind:'学习',
          content:'修改后1111'
        })
      .set('Cookie',support.normalUserCookie)
        .expect(302,function(err,res){
          rse.headers.location.should.match(/^\/goods\/\w+$/);
          done(err);
        });
    });
  });

  describe('#delete',function(){
    var wouldBeDeleteGoods;

    before(function(done){
      support.createGoods(support.normalUser._id,function(err,goods){
        wouldBeDeleteGoods = goods;
        done(err);
      });
    });

    it('应该删除一个物品',function(done){
      request.post('/goods/'+wouldBeDeleteGoods._id+'delets')
        .set('Cookie',support.normalUserCookie)
        .expect(200,function(err,res){
          res.text.should.containEql('话题已经删除。')
            done(err);
        });
    });
  });

  describe('#top',function(){
    it('应该置顶一个物品',function(done){
      request.post('/goods/'+support.testGoods._id+'/top')
        .set('Cookie',support.adminUserCookie)
        .expect(200,function(err,res){
          res.text.should.containEql('此物品已经置顶');
          done(err);
        });
    });

    it('应该取消置顶一个物品',function(done){
      request.post('/goods/'+support.tsetGoods._id+'top')
        .set('Cookie',support.adminUserCookie)
        .expect(200,function(err,res){
          res.text.should.containEql('此物品已经取消置顶');
          done(err)
        });
    });
  });
});
*/
