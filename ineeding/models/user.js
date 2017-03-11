var mongoose = require('mongoose');
var BaseModel = require('./base_model');//用于扩展
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  user_name:{type:String},                      //用户姓名
  login_name:{type:String},                     //用户登录名
  location:{type:String},                       //用户地址
  password:{type:String},                       //密码
  phone_number:{type:String},                   //电话号码
  gender:{type:String},                         //性别
  signature: { type: String },                  //个性签名
  student_number:{type:String},                 //学生学号
  blocked: {type: Boolean, default: false},     //锁定
  profile_image_url: {type: String},            //简介图片链接

  experence: { type: Number, default: 0 },      //经验
  address:{type:String},                        //学生详细地址
  qq_number:{type:String},                      //qq号
  id_image_url:{type:Array},                    //学生证照片
  profile: { type: String },                    //简介
  authened:{type:Boolean,default:false},        //是否已经学生认证
  is_admin:{type:Boolean,default:false},        //是否是管理员
  school:{type:String},                         //学校
  email:{type:String},                          //电子邮件
  update_at: { type: Date, default: Date.now }, //更新时间
  credit_level:{type:Number,default:0},         //信用等级

  create_at: { type: Date, default: Date.now }, //用户创建的日期
  reply_count: { type: Number, default: 0 },    //用户回复发布回复的数量
  trading_record:{type:Number,default:false},   //用户交易数量
  published_items:{type:Number,default:0},      //发布物品数量
  published_services:{type:Number,default:0},   //发布服务数量
  published_dreams:{type:Number,default:0},     //发布梦想的数量
});

UserSchema.index({_id:1});
UserSchema.index({create_at:-1});
console.log(mongoose.model('User',UserSchema));
