var eventproxy     = require('eventproxy');
var validator      = require('validator');
var config         = require('../config');
var User = require('../proxys').User;
var Send_message =  require('../proxys').Send_message;
var tools = require('../tools/tools');
var auth = require ('../middlewares/auth');

var ccap = require('ccap')({
  width:200,
  height:50,
  offset:30,
  quality:100,
  fontsize:40
});

/**
 * 注册 电话+密码+验证码
 */
exports.signup = function (req, res, next) {
  var pass          = validator.trim(req.body.password).toLowerCase();
  var vcode         = validator.trim(req.body.vcode).toLowerCase();//短信验证码
  var phone_number  = validator.trim(req.query.phone_number || req.body.phone_number).toLowerCase();
  var login_name    = validator.trim(req.query.login_name || req.body.login_name).toLowerCase();
  var vpic_session  = validator.trim(req.session.vpic).toLowerCase();
  var vpic          = validator.trim(req.body.vpic).toLowerCase(); //图片验证码

  var ep = new eventproxy();

  ep.fail(next);

  ep.on('prop_err', function (msg) {
    res.json({
      code:-20,
      msg:msg
    });
  });

  var user_regx     =  /^[a-zA-Z0-9\-_\u4E00-\uFA29|\uE7C7-\uE7F3]{1,20}$/i;//支持1-20个中文,下划线，横杠组成的字符
  var is_phone_regx = /^\d{1,11}$/;

  if ([pass, vcode, phone_number,login_name].some(function (item) {
    return item === '';
  })) {
    ep.emit('prop_err', '信息不完整。');
    return;
  }
  if (!user_regx.test(login_name)) {
    return ep.emit('prop_err', '用户名不合法。');
  }
  if(!is_phone_regx.test(phone_number)){
    ep.emit('prop_err','手机号码不正确');
    return ;
  }
  if (login_name.length < 2) {
    ep.emit('prop_err', '用户名至少需要2个字符。');
    return ;
  }
  if(vpic !== vpic_session){
    ep.emit('prop_err','图片验证码不正确');
    return ;
  }
  //查找是否昵称重复
  User.getUsersByQuery({phone_number:phone_number},{},
      function (err,users){
        if(err){
          return next(err);
        }
        if(users.length>0){//找到user
          return res.json({
            code:-20,
            msg:'电话号码已经被注册'
          });
        } else {
          //查找已经发送了短信的用户
          Send_message.getMsgByPhoneNumber(phone_number,ep.done(function(msg){
            msg = {};
            vcode = msg.vcode;
            if(!msg){
              return res.json({
                code:-20,
                msg:'注册失败!'
              });
            }
            if(vcode !== msg.vcode){
              return res.json({
                code:-20,
                msg:'短信验证码不正确'
              });
            }
            /*密码加密*/
            tools.bhash(pass,ep.done(function (passhash) {
              /*存储用户*/
              User.newAndSave(login_name,passhash,phone_number,false,function(err) {
                if (err) {
                  return next(err);
                }
                return res.json({
                  code:10,
                  msg:'注册成功'
                }); 
              });
            }));
          }));
        }});
};

/**
 * 登录
 */
exports.login = function (req, res, next) {
  var phone_number  = validator.trim(req.body.phone_number);
  var pass          = validator.trim(req.body.password).toLowerCase();
  var isNumber      = /^\d{11}$/;
  var ep            = new eventproxy();

  ep.fail(next);

  if(!phone_number||!pass){
    return res.json({
      code:-20,
      msg:'信息不完整'
    });
  }

  ep.on('login_error',function(login_error){
    res.json({ 
      code:-20,
      msg: "请核对后登录" 
    });
  });
  //仅通过手机号码登录
  User.getUserByPhoneNumber(phone_number,function(err,user) {
    if (err) {
      return next(err);
    }
    if(!isNumber.test(phone_number)){
      return res.json({
        code:-20,
        msg:'号码不符合规范'
      });
    }
    if (!user){
      return res.json({
        code:-20,
        msg:"该帐号的用户不存在"
      });
    }
    var passhash = user.password;
    //比较hash运算后的密码
    tools.bcompare(pass, passhash, ep.done(function (bool) {
      console.log(bool);
      if (!bool) {
        return ep.emit('login_error');
      }
      if(user.blocked){
        return res.json({
          code:-20,
          msg:'用户被锁定'
        });
      }
      auth.gen_session(user,res);
      res.json({
        code:10,
        msg:'登录成功'
      });
    }));
  });
};

/**
 * 注销
 */
exports.signOut = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, {
    path: '/' 
  });
  res.json({
    code:10,
    msg:"注销成功"
  });
};

/**
 * 更新密码,新密码!=旧密码，可以更新
 */
exports.updatePass = function (req, res, next) {
  var old_pass  = validator.trim(req.body.oldpassword);
  var new_pass  = validator.trim(req.body.newpassword);

  var user_id   = req.session.user._id;
  var pass_regx = /^[a-zA-Z0-9@]{6,40}$/i;
  var ep        = new eventproxy();

  ep.fail(next);

  ep.on('update_error',function(msg){
    res.json({
      code:-40,
      msg:msg
    });
  });

  if(!user_id){
    return ep.emit('update_error',"用户未登录");
  }
  if(!pass_regx.test(new_pass)){
    return ep.emit('update_error','密码不符合规范');
  }
  if(old_pass === new_pass){
    return ep.emit('update_error',"旧密码不能与新密码相同");
  }
  if(new_pass === ''||old_pass === ''){
    return ep.emit('update_error','信息不完整');
  } else {
    User.getUserById(user_id,function(err,user){
      if(!user){
        return res.json({
          code:-20,
          msg:'更新密码失败'
        });
      }
      if(err){
        return callback(err);
      }
      var passhash = user.password;
      tools.bcompare(old_pass,passhash,ep.done(function(bool){
        if(!bool){
          return res.json({
            code:-20,
            msg:"更新失败"
          });
        }
        tools.bhash(new_pass, ep.done(function (passhash) {
          user.password  = passhash;
          user.save(function(err){
            if (err) {
              return next(err);
            }
            return res.json({
              code:10,
              msg: '您的密码已更新。'
            });
          });
        }));
      }));
    });
  }
};

/**
 * 发送短信使用的是螺丝帽
 * refer : http://jingyan.baidu.com/article/5d6edee215ee9f99ebdeec61.html 
 * https://luosimao.com/docs/api/ 
 * 新建了proxys/send_message.js && models/send_message.js
 */
exports.sendMessage = function (req,res,next){
  //注册短信和重置密码短信
  var phone_number = validator.trim(req.body.phone_number);
  var is_signup    = validator.trim(req.body.is_signup);
  var postData = {
    mobile: phone_number,
    message: config.message_template
  };
  var inteval = 1000 * 20 ;//间隔时间
  var now = new Date();
  var ep = new eventproxy();

  if(!phone_number || phone_number.length !== 11 || !tools.isdigit(phone_number)){
    return res.json({
      code:-20,
      msg:'手机号码不正确'
    });
  }

  //判断是否已经注册过
  User.getUserByPhoneNumber(phone_number,function(err,user){
    if(err){
      return next(err);
    }
    if(user && is_signup){
      return res.json({
        msg:"用户已经存在,无需重新注册"
      });
    }
    //获取信息
    Send_message.getMsgByPhoneNumber(phone_number,function(err,msg){
      //发送短信
      ep.on("send message",function(flag){
        tools.sendMessage(postData,vcode,function(msg){
          msg.error = 0;//TODO 测试
          if(msg.error === 0){
            res.json({
              code:10,
              msg:"短信发送成功"
            });
            if(flag){
              ep.emit("update message");
            } else {
              ep.emit("save message");
            } 
          } else {
            return res.json({
              msg:"短信未发送成功"
            });
          }
        });
      });
      //新用户发送短信
      if(!msg){
        var vcode = tools.getRandomVcode();             //获取短信随机码
        ep.all("save message",ep.done(function(){
          Send_message.newAndSave(phone_number,vcode,function(err){
            if(err){
              return next(err);
            }
          });
          res.end();
        }));
        return ep.emit("send message",false);
      }
      ep.all("update message",ep.done(function(){
        msg.count++;
        msg.create_at = new Date().getTime();
        msg.save(function (err) {
          if(err){
            return next(err);
          }
        });
        res.end();
      }));
      //防止发送次数过频繁或过多
      if(msg.count > 5 || (now - msg.create_at) <= inteval ){
        return res.json({
          code:-80,
          msg:'时间太短或发送次数太多'
        });
      }
      ep.emit('send message',true);
    });
  });
};

/**
 * 发送重置短信,比对验证码,将密码置为123456
 */
exports.resetPass   = function (req, res, next) {
  var phone_number  = validator.trim(req.body.phone_number).toLowerCase();
  var vcode         = validator.trim(req.body.vcode).toLowerCase();
  var ep            = new eventproxy();

  ep.fail(next);

  //判定不能为空
  if(!phone_number||!vcode){
    return res.json({
      code:-30,
      msg:'请将信息填写完整'
    });
  } else {
    //读手机号码,发送
    User.getUserByPhoneNumber(phone_number,function(err,user){
      var postData = {
        mobile:phone_number,
        message:config.message_template
      };
      if(err){
        next(err);
      }
      if(!user){
        return res.json({
          code:-20,
          msg:'找不到该用户,请注册'});
      } else {
        Send_message.getMsgByPhoneNumber(phone_number,function(err,msg){//在collection里面找
          if(err){
            return next(err);
          }
          if(!msg){
            console.log("信息未找到");
            return res.end();
          }
          vcode = msg.vcode;
          if(vcode !== msg.vcode){
            return res.json({
              msg:'用户验证码不正确'
            });
          } else {
            var pwd = tools.getRandomVcode().toString();
            var password = pwd;
            tools.bhash(password, ep.done(function(passhash){
              user.password = passhash;
              user.save(function(err){
                if(err){
                  return next(err);
                }
                return res.json({
                  code:10,
                  msg:"您的密码已经重置为" + pwd + ",请及时更改"
                });
              });
            }));
          }
        });
      }
    });
  }
};

exports.getPic  = function(req, res){
  var ccap_array  = ccap.get();
  var txt         = ccap_array[0];
  var vpic        = ccap_array[1]; 

  req.session.vpic = txt;

  res.set({
    "content-type":"image/jpeg"
  });
  res.send(vpic);
};
