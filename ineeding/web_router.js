var express       = require('express');
var router        = express.Router();
var config        = require('./config');
var site          = require('./controllers/site');
var item          = require('./controllers/item');
var sign          = require('./controllers/sign');
var user          = require('./controllers/user');
var reply         = require('./controllers/reply');
var auth          = require('./middlewares/auth');
var message       = require('./controllers/message');

router.get('/',auth.isPhoneBrowser,site.index);                                       //主页的信息

if(config.allow_sign_up){
  router.post('/signup', sign.signup);                                                //提交注册信息
}

router.post('/login', sign.login);                                                    //登录校验
router.get('/getpic/*',sign.getPic);                                                  //获取验证图片
router.post('/signout', sign.signOut);                                                //登出

router.post('/updatepass',auth.userRequired,sign.updatePass);                         //更新密码

router.post('/update',auth.userRequired,user.settings);                               //更新user信息
router.post('/resetpass',sign.resetPass);                                             //重置密码

//search_page
router.post('/search',site.search);                                                   //提交搜索信息

router.post('/items', item.index);                                                    //显示item页面

router.post('/items/create',auth.authUser, item.create);                              //创建item
router.post('/items/:id/delete',auth.authUser, item.delete);                          //删除item
router.get('/items/:id/collected',auth.userRequired, item.collected);                 //判断item是否已经被收藏
router.post('/items/:id/collect',auth.userRequired, item.collect);                    //收藏item
router.post('/items/:id/de_collect',auth.userRequired, item.de_collect);              //取消收藏item
router.post('/items/:id/update',auth.userRequired, item.update);                      //更新item
router.post('/items/:id/changeblock',auth.userRequired, item.changeBlock);            //改变item锁定状态，意为下架
router.get('/items/:id/detail/',auth.userRequired, item.showDetail);                  //展示详情页
router.post('/upload/:id',auth.userRequired,item.upload);                             //上传图片
router.get('/upload/item/showpic',auth.userRequired,item.showUploadPic);              //显示上传图片
router.post('/upload/item/deletepic',auth.userRequired,item.deleteUploadPic);         //删除上传图片

router.get('/user',auth.userRequired, user.index);                                    //显示自己信息主页
router.get('/user/:name',auth.userRequired, user.index);                              //显示user信息主页,他人查看用户信息信息
router.post('/user/:name/identify',auth.userRequired, user.identify);                 //用户认证
router.get('/user/:name/changeblock', auth.adminRequired, user.changeBlock);          //改变用户锁定状态
router.post('/user/:name/changeauthen', auth.adminRequired, user.changeAuthen);       //改变用户认证状态
router.get('/user/:name/published',auth.userRequired,user.publish);                   //用户发布
router.get('/user/:name/collections',auth.userRequired,user.collections);             //用户收藏
router.post('/user/:name/settings',auth.userRequired, user.showSettings);             //用户信息

router.post('/reply/:id/create',auth.userRequired, reply.create);                     //回复
router.get('/reply/delete',auth.userRequired, reply.delete);                          //删除回复
router.post('/sendmessage', sign.sendMessage);                                        //发送短信

router.get('/my/messages',auth.userRequired, message.index);                          //获取所有消息
router.post('/messages/send',auth.userRequired, message.send);                        //发送私信消息
router.post('/messages/:id/delete',auth.userRequired, message.delete);                //删除私信消息

router.get('/showAdmin',auth.adminRequired, site.showAdmin);                          //展示管理界面
router.get('/sethot', auth.adminRequired, item.setHot);                               //设定是否热门
router.get('/showhot', item.showHot);                                                 //显示热门推荐

router.get('/*',function(req, res){
  res.redirect('/');
});

module.exports = router;
