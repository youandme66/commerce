var models = require('../models');
var Collection = models.Collection;
/**
 * 通过用户ID获取一个收藏
 * @param {String} user_id 
 * @param {String} iterm_id 
 * @param {Function} callback
 */
exports.getCollectionById=function(user_id,item_id,callback){
  Collection.findOne({user_id:user_id,item_id:item_id},callback);
};
/**
 * 保存收藏
 * @param {String} user_id
 * @param {String} item_id
 * @param {Function} callback 
 */
exports.saveCollection=function(data,callback){
  var collection = new Collection();
  collection.user_id = data.user_id;
  collection.item_id = data.item_id;
  collection.item_title = data.item_title;
  collection.item_price = data.item_price;
  collection.item_handle = data.item_handle;
  collection.item_image_url = data.item_image_url;
  collection.save(callback);
};
/**
 * 通过收藏ID删除收藏
 * @param {String} user_id
 * @param {String} item_id 
 * @param {Function} callback
 */

exports.deleteCollection=function(user_id,item_id,callback){
  Collection.remove({user_id:user_id,item_id:item_id},callback);
};

/**
 * 通过用户id获取列表
 * @param {String} user_id
 * param {callback} callback
 */
exports.getCollectionsByUserId = function(user_id,callback){
  Collection.find({user_id:user_id},'',{sort:{"create_at":-1}},callback);
};

