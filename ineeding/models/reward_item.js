var mongoose = require('mongoose');
var BaseModel = require('./base_model');//用于扩展
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
/*
 * 回报项列表信息
 */
var Reward_itemSchema = new Schema({
  author_id:{type:ObjectId},      //发布人
  dream_id:{type:ObjectId},       //梦想编号
  support_money:{type:Number},    //支持金额

  reward_item:{type:String},      //回报项
  reward_content:{type:String},   //回报内容
  reward_date:{type:Date}，       //回报时间
  restrict_member:{type:Number},  //限定名额
  reward_photo_url:{type:String}, //说明回报项图片
});

Reward_itemSchema.index({create_at:-1});
mongoose.model('Reward_item',Reward_itemSchema);
