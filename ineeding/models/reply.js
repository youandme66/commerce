var mongoose = require('mongoose');
var BaseModel = require('./base_model');//用于扩展
var ObjectId = Schema.ObjectId;

var ReplySchema = new Schema({
  content:{type:String},                        //回复内容
  item_id:{type:ObjectId},                      //回复的主题id
  author_id:{type:ObjectId},                    //回复的作者
  reported_bad:{type:Boolean,default:false},    //举报
  deleted:{type:Boolean,default:false},         //回复是否被删除
  zan_count:{type:Number,default:0},            //点赞的数量

  create_at: { type: Date, default: Date.now }, //创建时间
  update_at: { type: Date, default: Date.now }, //更新时间
});

ReplySchema.plugin(BaseModel);
ReplySchema.index({create_at:-1});
mongoose.model('Reply',ReplySchema);          //compile
