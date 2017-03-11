var config  = require('../config');
var io      = require("socket.io-emitter")({
  host:config.redis_host,
  port:config.redis_port
});
var count_user = 0;

exports.rtMessage = function(socket){
  socket.on("login", function(data){
    if(socket.user_name){
      console.log(socket.user_name);
      return;
    }
    socket.user_name = data.login_name;
    count_user++;
    console.log(socket.user_name);
    console.log(count_user);
  });

  socket.on("system", function(data){
    console.log("system called");
  });

  socket.on("online", function(data){
    socket.user_name = data.user_id;
    console.log("online called");
  });

  socket.on("send to all", function(data){
    console.log("send to all called");
  });

  socket.on("disconnect", function(data){
    console.log("disconnect called");
  });

  socket.on("error", function(err){
    if(err){
      return console.log(err);
    }
  });

};
