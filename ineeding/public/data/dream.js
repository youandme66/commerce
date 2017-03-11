var dream = require('dreamjs'); 
var fs = require('fs');

dream.customType('getWord', function(helper){
  return helper.chance.sentence({word:10});
});

var getNumber_0to100 = function(){
  return Math.floor(Math.random()*100);
};

var data = dream.schema({
  name: 'name',                           
  login_name: 'name',
  password: 'getWord',
  phone_number: /^(1[1-9]{10})$/,
  gender:'boolean',
  signature: /^\w{0,30}$/,
  student_number:/^([0-9]{11})$/,
  blocked:'boolean',
  profile_image_url:function(){
    return './images/test.jpg';
  },
  experence: function(){
  },
  address: 'address',
  qq_number:/^[0-9]{6,11}$/,
  id_image_url:function(){
    return './images/test.jpg';
  },
  profile: 'getWord',
  authened:'boolean',
  school:'name',
  email:'email',
  update_at:Date,
  credit_level: function(){
    return getNumber_0to100();
  },
  create_at:Date,
}).generateRnd(30)
.output(function(err,result){
  fs.writeFile('user_data.json',JSON.stringify(result),function(err){
    if(err){
      throw err;
    }
    console.log('done');
  });
});
