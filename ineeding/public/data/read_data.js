var fs = require("fs");

fs.readFile('user_data.json','utf-8',function(err,data){
  if(err){
    throw err;
  }
  var result = JSON.parse(data);
  console.log(result.phone_number);
});
