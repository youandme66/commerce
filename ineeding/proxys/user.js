var models  = require('../models');
var User    = models.User;

exports.getUserById = function(user_id,callback){
  User.findOne({_id:user_id},callback);
};

exports.getUsersByQuery = function (query, opt, callback) {
  User.find(query, '', opt, callback);
};

exports.getUserByPhoneNumber = function (phone_number,callback){
  User.findOne({"phone_number":phone_number}, callback);
};

exports.getUserByLoginName = function (login_name,callback){
  if (login_name.length === 0) {
    return callback(null, []);
  }
  User.findOne({ login_name: { $in: login_name } }, callback);
};

exports.getUserByName = function (login_name, callback) {
  if (login_name.length === 0) {
    return callback(null, []);
  }
  User.findOne({ login_name: login_name }, callback);
};

exports.newAndSave = function (login_name,passhash,phone_number,active,callback){
  var user         = new User();
  user.login_name   = login_name;
  user.phone_number = phone_number;
  user.password    = passhash;
  user.is_admin    = false;
  user.blocked      = active || false;
  user.save(callback);
};
exports.changeblock=function(user_id,callback){
  User.findOne({user_id:user_id},function(err,data){
    if(err){
      return next(err);
    }
    var blocked;
    if(data.blocked==true)
    {
      blocked=false;
    }
    if(data.blocked==false){
      blocked=true;
    }
    User.update({user_id:data.user_id},{$set:{blocked:blocked}},callback);
  });
  }
 

