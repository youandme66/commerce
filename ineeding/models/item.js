var mongoose = require('mongoose');
var BaseModel = require('./base_model');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');

var ItemSchema = new Schema({
  title:{type:String},                                   //标题
  author_id:{type:ObjectId},                             //发布者

  filter:{type:String},                                  //相当与tab标签分类
  //生活用品，体育器材，数码产品，学习用品
  phone_number:{type:String},                           //电话号码
  description:{type:String},                            //描述
  handle:{type:String},                                 //处理方式
  is_need:{type:Boolean},                               //是否是需求
  //租赁，抛售，交换
  price:{type:Number},                                   //价格
  image_url:{type:Array},                                //发布对物品需求不能上传图片
  blocked:{type:Boolean,default:false},                  //是锁定状态
  deleted: {type: Boolean, default: false},              //删除

  reply_count:{type:Number,default:0},                    //回复次数
  visit_count:{type:Number,default:0},                    //浏览次数
  collected_count: { type: Number, default: 0 },          //被收藏次数
  create_at: { type: Date, default: Date.now },           //创建日期
  update_at: { type: Date, default: Date.now },           //编辑时间
  last_reply_at: { type: Date, default: Date.now },       //最后回复
  valid_time:{type:Date,default:0},                       //有效时间
  author_email:{type:String},                             //邮箱

  is_up:{type:Boolean,default:false},                     //是否被置顶

  is_hot:{type:Boolean,default:false},                    //是否是推荐物品
  item_status:{type:Boolean},                             //物品状态,审核中
});

ItemSchema.index({create_at:-1,_id:-1});
mongoose.model('Item',ItemSchema);
