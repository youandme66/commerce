var Models = require('../models');
var Reply  = Models.Reply;
var User   = Models.User;
/**
 * 根据ReplyID获取消息
 * @param {String} reply_ID
 * @param ｛Function｝ callback 回调函数
 */
exports.getReplyById=function(reply_id,callback){
  Reply.findOne({_id:reply_id},callback);
}
/**
 * 根据itemID获得消息
 * @param {String} item_id
 * @param {Function} callback
 */
exports.getReplysByItemId=function(item_id,callback){
  Reply.find({item_id:item_id},'',{sort:'-update_at'},callback);
}
/**
 * 根据ReplyID获取消息,并赋予相关实例
 * @param {String} item_id
 * @param {Function} callback
 */
exports.getReplyAllById=function(reply_id,callback){
	if (!id) {
    return callback(null, null);
  }
  Reply.findOne({_id: id}, function (err, reply) {
    if (err) {
      return callback(err);
    }
    if (!reply) {
      return callback(err, null);
    }

    var author_id = reply.author_id;
    User.getUserById(author_id, function (err, author) {
      if (err) {
        return callback(err);
      }
      reply.author = author;
    });
    Item.getItemById(reply.item_id,function(item){
    	 if (err) {
        return callback(err);
      }
      reply.item = item;
    })
  });
}
/**
 * 保存一条reply
 * @param {String} content
 * @param {String} item_id
 * @param {String} author_id
 * @param {Function} callback
 */
exports.saveReply=function(content,item_id,author_id,callback){
 var reply =new Reply();
 reply.content=content;
 reply.item_id=item_id;
 reply.author_id;
 reply.save(callback);
}
