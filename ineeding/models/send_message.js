var mongoose  = require('mongoose');
var BaseModel = require('./base_model');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var Send_messageSchema = new Schema({
  phone_number:{type:String},             //电话号码
  vcode:{type:String},                    //验证码
  create_at:{type:Date,default:Date.now}, //创建日期
  count:{type:Number,default:0}           //发送短信次数
});

Send_messageSchema.plugin(BaseModel);
Send_messageSchema.index({_id:-1});
mongoose.model('Send_message',Send_messageSchema);
