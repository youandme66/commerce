var Message    = require('../proxys').Message;
var User       = require('../proxys').User;
var eventproxy = require('eventproxy');
var config  = require('../config');
var io      = require("socket.io-emitter")({
  host:config.redis_host,
  port:config.redis_port
});

/**
 * 用于处理消息请求
 * 需要判断用户登入状态
 */
exports.index = function (req, res, next) {
  var user_id = req.session.user._id;
  var ep = new eventproxy();

  ep.fail(next);

  ep.all('has_read_messages', 'hasnot_read_messages', function (has_read_messages, hasnot_read_messages) {
    return res.json({
      code:10,
      msg:{
        has_read_messages: has_read_messages,
        hasnot_read_messages: hasnot_read_messages
      }
    });
  });

  Message.getReadMessagesByUserId(user_id, function(err,has_read_messages){
    ep.emit('has_read_messages',has_read_messages);
  });

  Message.getUnreadMessageByUserId(user_id,function(err, hasnot_read_messages){
    ep.emit('hasnot_read_messages',hasnot_read_messages);
  });
};

/**
 * 向某人/全体发送消息信息
 */
exports.send = function(req, res, next){
  var author_user           = req.session.user;
  var receiver_phone_number = req.body.receiver_phone_number;
  var content               = req.body.content;
  var is_admin              = author_user.is_admin;

  var ep = new eventproxy();

  ep.on("send_error",function(msg){
    return res.json({
      code:-20,
      msg:msg
    });
  });

  if(!author_user){
    ep.emit("send_error","请先登录");
    return ;
  }
  if(!receiver_phone_number || receiver_phone_number.length !== 11){
    ep.emit("send_error","请给出正确的收信人的电话号码");
    return;
  }
  if(!content || content.length < 2 ){
    ep.emit("send_error","内容长度太短");
    return;
  }

  User.getUserByPhoneNumber(receiver_phone_number,function(err,user){
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({
        code:-20,
        msg:"没有该用户"
      });
    }
    var receiver_id = user._id;
    var author_id = author_user._id;
    var author_login_name = author_user.login_name;
    Message.sendMessage(author_id,receiver_id,content,author_login_name,function(err){
      if(err){
        return next(err);
      }
      io.to(user.login_name).emit("got a message",{
        author_user:author_user,
        content:content,
        create_at: new Date()
      });
      return res.json({
        code:10,
        msg:"发送成功"
      });
    });
  });
};

/**
 * 删除私信
 */
exports.delete = function(req, res, next){
  var message_id = req.params.message_id || req.body.message_id;
  var user_id    = req.session.user._id;

  if(!message_id){
    return res.json({
      code:-20,
      msg:"未找到该信息"
    });
  }

  Message.getMessageById(user_id,message_id,function(err,message){
    if(err){
      return next(err);
    }
    if(!message){
      return res.json({
        code:-20,
        msg:"未找到数据"
      });
    }

    var msg_id = message._id;
    Message.deleteMessage(msg_id,user_id,function(err){
      if(err){
        return next(err);
      }
      return res.json({
        code:10,
        msg:"删除成功"
      });
    });
  });
};
