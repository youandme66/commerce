var ready      = require('ready');
var eventproxy = require('eventproxy');

function randomInt() {
  return (Math.random() * 10000).toFixed(0);
}

var createUser = exports.createUser = function(callback){
  var key = new Date().getTime()+'_'+randomInt();
};

var createGoods = exports.createGoods = function(callback){
  var key = new Date().getTime()+'_'+randomInt();
};

function mockUser(user){

}

ep.all('user', 'user2', 'admin', function (user, user2, admin) {
  exports.normalUser = user;
  exports.normalUserCookie = mockUser(user);

  exports.normalUser2 = user2;
  exports.normalUser2Cookie = mockUser(user2);

  var adminObj = JSON.parse(JSON.stringify(admin));
  adminObj.is_admin = true;
  exports.adminUser = admin;
  exports.adminUserCookie = mockUser(adminObj);

  createItem(user._id, ep.done('item'));
});

createUser(ep.done('user'));
createUser(ep.done('user2'));
createUser(ep.done('admin'));

ep.all('item', function (item) {
  exports.testItem = item;
  createReply(item._id, exports.normalUser._id, ep.done('reply'));
});

var ep = new eventproxy();
ep.all('reply', function (reply) {
  exports.testReply = reply;
  exports.ready(true);
});

ready(exports);

var normalUserCookie = exports.normalUserCookie = function(){

};
