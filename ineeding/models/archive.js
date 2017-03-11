var mongoose = require('mongoose');
var BaseModel = require('./base_model');        //用于扩展
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
/**
 * 记录学生学籍信息
 */
var ArchiveSchema = new Schema({
  user_id:{type:ObjectId},                      //档案编号
  student_name:{type:String},                   //学生姓名
  student_number:{type:String},                 //学生编号
  image_url:{type:String},                      //头像
  gender:{type:String},                         //性别
  start_school:{type:Date,default:Date.now},    //入学日期
  grade_level:{type:String},                    //学年
  born_date:{type:Date},                        //出生日期
  born_place:{type:String},                     //生源地
  major:{type:String},                          //专业
  major_category:{type:String},                 //专业类别
  which_class:{type:String},                    //所在班级
  politic_status:{type:String},                 //政治面貌
  id_card:{type:String},                        //身份证号
});

mongoose.model('Archive',ArchiveSchema);
