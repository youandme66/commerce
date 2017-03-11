var mongoose = require('mongoose');
var BaseModel = require('./base_model');//用于扩展
/*
 * 创建支持用户的列表
 */
var Support_memberSchema = new Schema({
  user_id:{type:ObjectId},                  //用户id
  dream_id:{type:ObjectId},                 //梦想id
  money:{type:Number,default:0},            //从回报项填写的金额读取
  support_number:{type:Number,default:0},   //订单页面支持的数量
  support_day:{type:Date,default:Date.now}, //支持天数
  selection:{type:Number},                  //回报项类型选择
  create_at:{type:Date,default:Date.now}    //创建时间
});

Support_memberSchema.plugin(BaseModel);
Support_memberSchema.index({create_at:-1});
mongoose.model('Support_member',Support_memberSchema);
