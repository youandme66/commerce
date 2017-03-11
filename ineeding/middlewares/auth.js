var config      = require('../config');
var models      = require('../models');
var UserModel   = models.User;
var proxyUser   = require('../proxys').User;
var validator   = require('validator');
var eventproxy  = require('eventproxy');

/**
 * 生成cookie
 * @params user {JSON Object} 用户
 * @params res {response}
 * return
 */
exports.gen_session = function (user, res){
  var auth_token = user._id + '$$$$';
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30, //30天
    signed: true,
    httpOnly: false
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); 
};

/**
 * 验证用户是否登录。
 * @params req {request}
 * @params res {response}
 * @next
 */
exports.userRequired = function(req,res,next){
  if(!req.session.user){
    return res.json({
      code: -20,
      msg:'对不起请登录'
    });
  }
  if(req.session.user.is_admin){
    req.session.user.authened = true;
    req.session.user.blocked = false;
  }
  next();
};

/**
 * 验证用户时候认证
 */
exports.userAuthened = function(req, res, next){
  if(!req.session.user){
    return res.json({
      code:-20,
      msg:"抱歉，请登录"
    });
  } else{
    if(!req.session.user.authened){
      return res.json({
        code:-20,
        msg:"请认证后操作"
      });
    }
    next();
  }
};

/**
 * 验证用户是否有管理员权限
 */
exports.adminRequired = function (req,res,next){
  if(!req.session.user.is_admin){
    return res.json({
      code:-70,
      msg:'需要管理员权限'
    });
  }
  next();
};

/**
 * 用户被锁定
 */
exports.blocked = function(req, res ,next){

  if (req.path === '/signout') {
    return next();
  }

  if(req.session.user && req.session.user.blocked){
    return res.json({
      code:-20,
      msg:'抱歉，您已经被锁定'
    });
  }
  next();
};


/**
 * 通过cookie中id生成session
 */
exports.authUser = function(req, res, next){
  var ep           = new eventproxy();
  ep.fail(next);

  res.locals.user = null;

  //如果存在cookie
  if(req.cookies.user){
    var user = JSON.parse(req.cookies.user);
    //通过id生成一个session
    req.session.user = new UserModel(user);
    //是管理员
    if (user.is_admin) {
      req.session.user.is_admin = true;
    }
    return next();
  }

  //查找用户
  ep.all('getUser',function(user){
    if(!user){
      return next();
    }

    user = res.locals.user = req.session.user = new UserModel(user);
    if(!req.session.images){
      req.session.images = [];
    }

    if(config.admins.hasOwnProperty(user.login_name)){
      user.is_admin = true;
      user.authened = true;
    }
    return next();
  });

  if(req.session.user){
    ep.emit('getUser',req.session.user);
  } else {
    var authCode = req.signedCookies[config.auth_cookie_name];
    if(!authCode){
      return next();
    }

    var auth    = authCode.split('$$$$');
    var user_id = auth[0];
    proxyUser.getUserById(user_id,ep.done('getUser'));
  }
};

/**
 * 需要是手机浏览器，并非电脑
 */
exports.isPhoneBrowser = function(req, res, next){
  var deviceAgent = req.headers["user-agent"];
  var agentID = deviceAgent.match(/(iphone|ipod|ipad|Android)/);
  if(agentID !== '' && agentID){
    return next();
  }else{
    return res.json({
      code:-20,
      msg:'请使用手机登录'
    });
  }
  next();
};
