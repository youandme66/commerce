var models        = require('../models');
var Send_message  = models.Send_message;

exports.getMsgByPhoneNumber = function(phone_number,callback){
  Send_message.findOne({phone_number:phone_number},callback);
};

exports.newAndSave = function(phone_number,vcode,callback){
  var send_message = new Send_message();

  send_message.phone_number = phone_number;
  send_message.vcode        = vcode;
  send_message.save(callback);
};
