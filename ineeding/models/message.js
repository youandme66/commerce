var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var MessageSchema = new Schema({
  receiver_id: { type: ObjectId },　            //接收者id
  author_id: { type: ObjectId },                //发送者id
  author_login_name:{ type: String },           //发送者login_name
  content:  { type: String },                   //信息内容
  has_read: { type: Boolean, default: false },  //已读
  create_at: { type: Date, default: Date.now }
});

MessageSchema.plugin(BaseModel);
MessageSchema.index({has_read: -1, create_at: -1});

mongoose.model('Message', MessageSchema);

