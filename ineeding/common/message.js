var models    = require('../models');
var Message   = models.Message;
var eventproxy = require('eventproxy');
/**
 * 一个只返回undefined的函数，用于未指定callback的情况
 */
var noop = function () {
    return undefined;
};

/**
 * 发送消息
 * @params receiver_id {String} 接受者id
 * @params author_id {String} 发送者id
 * @params item_id {String} 物品/需求id
 * @params reply_id {String} 回复id
 * @params callback {JSON Object}
 */
exports.sendMessage = function (receiver_id, author_id, item_id, reply_id, callback) {
  callback = callback || noop;
  var ep = new eventproxy();
  ep.fail(callback);

  var message       = new Message();
  message.receiver_id = receiver_id;
  message.author_id = author_id;
  message.item_id  = item_id;
  message.reply_id  = reply_id;
  message.save(ep.done('message_saved'));
  ep.all('message_saved', function (msg) {
    callback(null, msg);
  });
};
