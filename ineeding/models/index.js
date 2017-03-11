var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db,{
  server:{poolSize:20}
},function(err){
  if(err){
    process.exit(1);
  }
});

require('./user');
require('./send_message');
require('./item');
require('./message');
require('./collection');

exports.Item         = mongoose.model('Item');
exports.User         = mongoose.model('User');
exports.Send_message = mongoose.model('Send_message');
exports.Message      = mongoose.model('Message');
exports.Collection   = mongoose.model('Collection');
