var User        = require('../proxys').User;
var Item        = require('../proxys').Item;
var Collection  = require('../proxys').Collection;
var Message     = require('../proxys').Message;

var tools       = require('../tools/tools');
var config      = require('../config');
var validator   = require('validator');
var nodemailer  = require('nodemailer');
var eventproxy  = require('eventproxy');

/**
 * 用户中心
 */
exports.index   = function (req, res, next) {
  var user_name = req.params.name;
  var user      = req.session.user;
  var is_admin  = req.session.user.is_admin;

  //如果未指定name,则访问自己的简介信息，否则为他人访问简介信息
  if(!user_name){
    User.getUserById(user._id,function(err,user){
      if(err){
        return next(err);
      }
      if(!user){
        return res.json({
          code:10,
          msg:"未找到信息"
        });
      }
      var user_obj = user._doc;
      var user_new = tools.hideInformation(user_obj,1);
      return res.json({
        code:10,
        msg:user_new
      });
    });
  } else {
    User.getUserByLoginName(user_name, function (err, user){
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json({
          code:-20,
          msg:"这个用户不存在"
        });
      }
      if(user.blocked){
        return res.json({
          code:10,
          msg:'抱歉，您的账号已经被锁定'
        });
      }
      var user_info = user._doc;
      if(!is_admin){
        user_info =  tools.hideInformation(user._doc,3);
      }
      return res.json({
        code:10,
        msg:user_info,
      });
    });
  } 
};

/**
 * 显示用户信息详情页
 */
exports.showSettings = function (req, res, next) {
  var login_name = validator.trim(req.params.name);//登录名
  var user       = req.session.user;
  var user_id    = req.session.user._id;
  var is_admin   = req.session.user.is_admin;

  if(login_name === user.login_name){
    login_name = '';
  }
  if(!login_name){
    User.getUserById(user_id, function (err, user) {
      if (err) {
        return next(err);
      }
      if(!user){
        return res.json({
          code:10,
          msg:"未找到这个用户"
        });
      } else {
        if(!is_admin){
          user = tools.hideInformation(user._doc,1);
        }
        return res.json({
          code:10,
          msg:user
        });
      }
    });
  } else {
    User.getUserByName(login_name,function(err,user){
      if(err){
        return next(err);
      }
      if(!user){
        return res.json({
          code:-20,
          msg:"没有数据"
        });
      }
      var hide_user = user._doc;
      if(!is_admin){
        if(!req.session.user.authened){
          hide_user = tools.hideInformation(hide_user,3);
        } else {
          hide_user = tools.hideInformation(hide_user,2);
        }
      }
      return res.json({
        code:10,
        msg:hide_user
      });
    });
  }
};

/**
 * 用户信息更新页
 */
exports.settings = function (req,res,next){
  var user_name         = validator.trim(req.body.user_name);    //用户真实姓名,可为空
  var login_name        = validator.trim(req.body.login_name);
  var gender            = validator.trim(req.body.gender);
  var signature         = validator.trim(req.body.signature);
  var email             = validator.trim(req.body.email);
  var location          = validator.trim(req.body.location);
  var school            = validator.trim(req.body.school);
  var user              = req.session.user;
  var new_phone_number  = validator.trim(req.body.phone_number);
  var student_number    = validator.trim(req.body.student_number);
  var qq_number         = validator.trim(req.body.qq_number);
  var is_admin          = req.session.user.is_admin;
  var ep                = new eventproxy();
  var update_obj        = {
    user_name           :user_name,
    login_name          :login_name,
    signature           :signature,
    gender              :gender,
    school              :school,
    phone_number        :new_phone_number,
    qq_number           :qq_number,
    student_number      :student_number,
    location            :location,
    email               :email,
  };

  ep.fail(next);

  if(gender !== '' && gender !== '男' && gender !== '女' ){
    return res.json({
      code:-20,
      msg:"请不要随意填写"
    });
  }

  if(!login_name){
    login_name = user.login_name;
  }

  ep.on("save_settings",function(user){
    for(var pro in update_obj){
      if(!update_obj[pro]){
        continue;
      } else {
        req.session.user[pro] = user[pro] = update_obj[pro];
      }
    }
    user.save(function(err){
      if(err){
        return next(err);
      }
      return res.json({
        code:10,
        msg:"保存成功"
      });
    });
  });

  ep.on("check_user",function(){
    User.getUserById(user._id,function(err,user){
      if(err){
        return next(err);
      }
      if(!user){
        return res.json({
          code:-20,
          msg:"未找到用户"
        });
      }
      ep.emit("save_settings",user);
    });
  });

  if(new_phone_number.length !== 0){
    if(new_phone_number === user.phone_number){
      return res.json({
        code:-20,
        msg:"您没有更换电话号码"
      });
    }
      if(new_phone_number.length !== 11 || !tools.isdigit(new_phone_number,"")){
        return res.json({
          code:-20,
          msg:"请输入正确的电话号码"
        });
      }
      User.getUserByPhoneNumber(new_phone_number,function(err,user){
        if(user){
          return res.json({
            code:-20,
            msg:"该手机号码已经被占用"
          });
        }
        ep.emit("check_user");
      });
  } else {
    ep.emit("check_user");
  }

};

/**
 * 改变用户锁定状态
 */
exports.changeBlock = function(req, res, next){
  var user=validator(req.session.user);
  var user_id=validator(req.session.user.user_id);
  var flag=validator(req.session.user.is_admin);
  if(!user){
    res.json({
      code:-20,
      msg:"用户请登录"
    });
    if(flag){
      User.changede_block(user_id,function(err){
        if(err){
          res.json({
            code:-20,
            msg:"失败"
          });
        }
        else{
          res.json({
            code:10,
            msg:"成功"
          });
        }
      });
    }
    else
    {
      res.json({
        code:-20,
        msg:"你不是管理员，请以管理员身份登录！"
      });
    }
  }
};
/**
 * 显示用户已经发布的item
 */
exports.publish = function(req,res,next){
  var author_id = req.session.user._id;
  var user = req.session.user;
  if(!user){
    return res.json({
      code:-20,
      msg:"用户请登录"
    });
  }
  Item.getItemByAuthor_id(author_id,function(err,item){
    if(err){
      return next(err);
    }
    if(item.length === 0 ){
      return res.json({
        code:-20,
        msg:"数据为空"
      });
    }

    return res.json({
      code:10,
      msg:item
    });
  });
};
/**
 * 显示用户已经收藏的item
 */
exports.collections = function(req,res,next){
  var user_id = req.session.user._id;
  var user    = req.session.user;
  var ep      = new eventproxy();

  ep.fail(next);

  if(!user){
    return res.json({
      code:-20,
      msg:"用户请登录"
    });
  }
  Collection.getCollectionsByUserId(user_id,function(err,collections){
    if(err){
      return next(err);
    }
    if(!collections || collections.length === 0){
      return res.json({
        code:-20,
        msg:"您还没有收藏"
      });
    }

    return res.json({
      code:10,
      msg:collections
    });

  });
}; 

/**
 * 改变用户认证状态
 */
exports.changeAuthen = function(req, res, next){
  var admin    = req.session.user;
  var user_id  = req.body.user_id;
  var admin_id = admin._id;

  if(!admin.is_admin){
    return res.json({
      code:-20,
      msg:"请用管理员账号登录"
    });
  }
  if(!user_id){
    return res.json({
      code:-20,
      msg:"信息不完整"
    });
  }

  User.getUserById(user_id,function(err,user){
    if(err){
      return next(err);
    }
    if(!user || user.length === 0){
      return res.json({
        code:10,
        msg:"找不到该用户,或用户已经被锁定"
      });
    }
    if(!user.authened || user.authened == false){
      user.authened = true;
    } else {
      user.authened = false;
    }
    user.save(function(err){
      if(err){
        return next(err);
      }
      return res.json({
        code:10,
        msg:"更改成功"
      });
    });
  });

};

exports.identify    = function(req, res, next){
  var user_name     = validator.trim(req.body.name);
  var user_id       = req.session.user._id;
  var school        = validator.trim(req.body.school);
  var login_name    = req.session.user.login_name;
  var ep            = new eventproxy();

  ep.on("identify error",function(msg){
    return res.json({
      code:-20,
      msg:msg
    });
  });

  if(!user_name){
    return ep.emit("identify error","请将信息填写完整");
  }

  ep.on("message_to admin", function(admin_id,content,admin_email){

    Message.sendMessage(user_id,admin_id,content,login_name,function(err){
      if(err){
        return next(err);
      }
      return res.json({
        code:10,
        msg:"已经将信息发送给管理员，请耐心等待审核。如有疑问，请发邮件到635044633@qq.com"
      });
    });

    if(!admin_email){
      console.log(admin_id + "管理员没有填写邮箱");
    } else {
      var transporter = nodemailer.createTransport(config.smtpConfig);
      config.mailOptions.html = "<h1>" + content + "</h1>";
      config.mailOptions.to   = admin_email;
      transporter.sendMail(config.mailOptions,function(err,info){
        if(err){
          return console.log(err);
        }
        console.log(info.response);
      });
    }

  });

  ep.on("identify_info done",function(){
    User.getUsersByQuery({is_admin:true},function(err,users){
      if(err){
        return next(err);
      }
      if(!users || users.length === 0){
        console.log("没有找到管理员");
        return res.json({
          code:-20,
          msg:"服务器错误"
        });
      }
      var content     = login_name + "已经上传了认证图片，请及时核实";
      for(var i=0 ;i < users.length ; i++){
        var admin_email = users[i].email;
        var admin_id = users[i]._id;
        ep.emit("message_to admin",admin_id,content,admin_email);
      }
    });
  });

  User.getUserById(user_id,function(err,user){
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({
        code:-20,
        msg:"找不到用户"
      });
    }
    user.user_name    = user_name;
    user.school       = school;
    console.log(req.session.images);
    user.id_image_url = req.session.images[0];
    user.save(function(err){
      if(err){
        return next(err);
      }
      ep.emit("identify_info done");
    });
  });

};
