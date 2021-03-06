var EventProxy = require('eventproxy');
var Message = require('../models').Message;
var User = require('./user');
var Item = require('./item');
var Reply = require('./reply');
/*******************************/
var noop = function () {
    return undefined;
};
/**
 * 根据用户ID，获取未读消息的数量
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - count, 未读消息数量
 * @param {String} id 用户ID
 * @param {Function} callback 获取消息数量
 */
exports.getMessagesCount = function (id, callback) {
  Message.count({master_id: id, has_read: false}, callback);
};


/**
 * 根据消息Id获取消息
 * Callback:
 * - err, 数据库错误
 * - message, 消息对象
 * @param {String} id 消息ID
 * @param {Function} callback 回调函数
 */
exports.getMessageById = function (id, callback) {
  Message.findOne({_id: id}, function (err, message) {
    if (err) {
      return callback(err);
    }
    getMessageRelations(message, callback);
  });
};

/**
 * 根据用户ID，获取已读消息列表
 * Callback:
 * - err, 数据库异常
 * - messages, 消息列表
 * @param {String} userId 用户ID
 * @param {Function} callback 回调函数
 */
exports.getReadMessagesByUserId = function (userId, callback) {
  Message.find({receiver_id: userId, has_read: true}, null,
    {sort: '-create_at', limit: 20}, callback);
};

/**
 * 根据用户ID，获取未读消息列表
 * Callback:
 * - err, 数据库异常
 * - messages, 未读消息列表
 * @param {String} userId 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUnreadMessageByUserId = function (userId, callback) {
  Message.find({receiver_id: userId, has_read: false}, null,
    {sort: '-create_at'}, callback);
};


/**
 * 将消息设置成已读
 */
exports.updateMessagesToRead = function (userId, messages, callback) {
  callback = callback || noop;
  if (messages.length === 0) {
    return callback();
  }

  var ids = messages.map(function (m) {
    return m.id;
  });

  var query = { master_id: userId, _id: { $in: ids } };
  Message.update(query, { $set: { has_read: true } }, { multi: true }).exec(callback);
};

/**
 * 发送消息
 */
exports.sendMessage = function(author_id,receiver_id,content,author_login_name,callback){
  var message = new Message();
  message.receiver_id = receiver_id;
  message.author_login_name = author_login_name;
  message.author_id = author_id;
  message.content = content;
  message.save(callback);
};

/**
 * 删除私信消息
 */
exports.deleteMessage = function(message_id,user_id,callback){
  Message.remove({_id:message_id,receiver_id:user_id},callback);
};
/**
 * 通过user_id和message_id获取message
 */
exports.getMessageById = function(user_id,message_id,callback){
  Message.findOne({receiver_id:user_id,_id:message_id},callback);
};
