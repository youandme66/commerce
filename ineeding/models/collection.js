var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var BaseModel = require('./base_model');        //用于扩展
/*
 * 用户收藏列表
 */
var CollectionsSchema = new Schema({
  user_id:{type:ObjectId},                      //收藏者
  item_id:{type:ObjectId},                      //收藏ID,包括物品，服务，梦想
  item_image_url:{type:Array},                  //item的图片链接
  item_title:{type:String},                     //item标题
  item_handle:{type:String},                    //item处理方式
  item_price:{type:Number},                     //item价格
  create_at:{type:Date,default:Date.now},       //创建日期
});
CollectionsSchema.index({create_at:-1});
mongoose.model('Collection',CollectionsSchema);
