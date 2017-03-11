var bcrypt = require('bcryptjs');
var https = require('https');
var querystring = require('querystring');
var crypto = require('crypto');

/**
 * 获取一定长度字符串。
 * @params {length} 长度
 * return {String}
 */
exports.getRandomVcode = function(){
  var Num = "";
  for(var i=0;i<6;i++){
    Num += Math.floor(Math.random(Math.random())*10);
    Num = Num.toString();
  }
  return Num;
};

/**
 * 获取hash字符串
 */
exports.hashString = function(){
  return crypto.createHash("md5").update(Math.random().toString()).digest('hex').substring(0,24);
};

/**
 * 对传入的字符串加密
 * @params str {String} 传入字符串
 * @params @params callback {String}
 */
exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);   //10为saltRounds，即随机数
};

/**
 * 比较hash运算后的数据
 * @params str {String} 传入的字符串
 * @params passhash {String} hash串
 * @params callback {Boolean} 返回Boolean
 */
exports.bcompare = function (str, passhash, callback) {
  bcrypt.compare(str, passhash, callback);
};

/**
 * mobile + time
 * 发送短信
 * @params postData {String} 短信息模板
 * @params vcode {vcode} 验证码
 * @params callback {JSON} 有message.error message.msg可访问
 */
exports.sendMessage = function (postData,vcode,callback){
  if(!postData){
    console.log('postData is null');
    return next(err);
  }
  var content = querystring.stringify(postData);//mobile=18120583139&message=nice
  var options = {
    host:'sms-api.luosimao.com',
    path:'/v1/send.json',
    method:'POST',
    auth:'api:key-4fbdaaccb3069fb443b6c3da25b2ce7d',
    agent:false,
    rejectUnauthorized : false,
    headers:{
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' :content.length
    }
  };
  var req = https.request(options,function(res){
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var msg_return = JSON.parse(chunk);
      callback(msg_return);
    });
  });

  req.on('error',function(e){
    console.log("error:" + e);
    callback({
      error:-20,
      msg:"短信未发送成功",
    });
    req.end();
  });
  req.write(content);
};

/**
 * 去掉一些隐蔽的信息
 */
exports.hideInformation = function(obj,level){
  if(!level){
    level = 3;
  }
  if(obj.hasOwnProperty("_doc")){
    obj = obj._doc;
  }
  var sensitiveInformation = [
    "update_at"           ,
    "reply_count"         ,
    "trading_record"      ,
    "published_items"     ,
    "published_services"  ,
    "published_dreams"    ,
    "visit_count"         ,
    "collected_count"     ,
    "zan_count"           ,
    "reported_bad"        ,
    "deleted"             ,
    "password"            ,
    "__v"                 ,
    "credit_level"        ,
    "is_need"             ,
    "collected_count"     ,
    "is_up"               ,
    "id_image_url"        ,
  ];
  switch(level){
    case 1:
      break;
    case 2:
      sensitiveInformation.push('_id','qq_number','location');
      break;
    case 3:
      sensitiveInformation.push('user_name','phone_number','qq_number','location','_id');
      break;
    case 4:
      sensitiveInformation.push('create_at','is_admin',"authened","blocked","experence");//用户信息修改
      break;
    default:
      break;
  }
  var obj_pro = Object.keys(obj);
  var newObj = {};
  for (var i = 0; i < sensitiveInformation.length; i++) {
    var prop = sensitiveInformation[i];
    if (obj.hasOwnProperty(prop)) {
      obj_pro = obj_pro.filter(function(item){
        if(item != prop){
          return item;
        }
      });
    }

  }
  for(var j = 0; j < obj_pro.length; j++){
    newObj[obj_pro[j]] = obj[obj_pro[j]];
  }
  return newObj;
};


/**
 * 判断是否是数字
 * opt加入特殊字符
 */
exports.isdigit = function(str,opt){
  var opt = opt || "";
  var str = str.toString();
  for (var i = 0; i < opt.length; i++) {
    str = str.replace(opt[i], "");
  }
  for(var i=0; i < str.length;i++){
    var tag = isNaN(str[i]);
    if(tag){
      return false;
    }
  }
  return true;
}
