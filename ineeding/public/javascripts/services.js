angular.module('services', [
    "ngCookies",
])

/**
 * 认证服务
 */
.factory('AuthenServices',['$cookies','BaseHttpServices','PromiseBackServices', function($cookies,BaseHttpServices,PromiseBackServices){
  return {
    /**
     * 登录
     * @params login_form {object}
     */
    login: function(login_form){
      if(!login_form){
        return PromiseBackServices({
          code:-20,
          msg:"请将信息填写完整再提交"
        });
      }
      var data = {
        url:'/login',
        method:'POST',
        data:login_form
      };
      return BaseHttpServices.getHttpService(data);
    },

    /**
     * 注册
     */
    signup:function(signup_form){
      var data = {
        url:'/signup',
        method:'POST',
        data:signup_form
      };
      return BaseHttpServices.getHttpService(data);
    },
    /**
     * 注销
     */
    signout:function(){
      $cookies.remove("INeeding");
      var data = {
        url: '/signout',
        method:'POST',
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    },
    /**
     * 重置密码
     */
    resetPass:function(reset_pass_form){
      var data = {
        url:'/resetpass',
        method:'POST',
        data:reset_pass_form
      };
      return BaseHttpServices.getHttpService(data);
    },
    sendMessage: function(phone_number){
      var data = {
        url:'/sendmessage',
        method:'POST',
        data:{phone_number:phone_number}
      };
      return BaseHttpServices.getHttpService(data);
    },
    /**
     * 更新密码
     */
    updatePass: function(update_pass_form){
      var data = {
        url:'/updatepass',
        method:'POST',
        data:update_pass_form
      };
      return BaseHttpServices.getHttpService(data);
    },
    /**
     * 认证信息
     */
    identify: function(identify_form){
      var name = identify_form.name;
      var data = {
        url:"/user/" + name + "/identify",
        method:"POST",
        data:identify_form
      };
      return BaseHttpServices.getHttpService(data);
    },
    changeAuthen: function(user_id,login_name){
      var data = {
        url: "/user/" + login_name + "/changeauthen",
        method: "POST",
        data:{"user_id":user_id}
      };
      return BaseHttpServices.getHttpService(data);
    }
  };
}])

/**
 * 提供promise形式的返回函数
 */
.factory("PromiseBackServices",['$q',function($q){
  var deferred = $q.defer();
  return function(data){
    if(data.code < 0){
      deferred.reject({
        code:-20,
        msg:data.msg,
      });
    } else {
      deferred.resolve(data);
    }
    return deferred.promise;
  };
}])


/**
 * 提供基础Http服务
 *
 * @params {Object} data
 * @return {function} http函数]
 */
.factory('BaseHttpServices',['$http','$rootScope',function($http,$rootScope){
  return {
    getHttpService:function(data){
      return $http({
        url:data.url,
        method:data.method,
        data:data.data,
        headers:data.headers
      });
    }
  };
}])

/**
 * 提供items的增删改查服务
 */
.factory('itemServices',['$rootScope','BaseHttpServices','PromiseBackServices',function($rootScope,BaseHttpServices,PromiseBackServices){
  return {
    deleteItem: function(id){
      if(!id){
        return PromiseBackServices({
          code:-20,
          msg:"id不能为空"
        });
      }
      if(typeof id === "object"){
        return console.log('id 不能是object');
      }
      var data = {
        url:'/items/' + id + "/delete",
        method:'POST',
        data:{id:id},
      };
      return BaseHttpServices.getHttpService(data);
    },
    getItems: function(item_form){
      if([item_form.filter].some(function(item){
        return item === '';
      })){
        return PromiseBackServices({
          code:-20,
          msg:"信息不能为空"
        });
      }
      var data = {
        url:"/items",
        method:"POST",
        data:item_form,
      };
      return BaseHttpServices.getHttpService(data);
    },
    //显示item详细信息
    showItem: function(id){
      var data = {
        url: '/items/' + id + "/detail",
        method: 'GET',
        data:null,
      };
      return BaseHttpServices.getHttpService(data);
    },
    //更新单个item
    updateItem: function(item_form){
      var data = {
        url:"/items/" + item_form._id + "/update",
        method:"POST",
        data:item_form.data
      };
      return BaseHttpServices.getHttpService(data);
    },
    //创建单个item
    createItem: function(item_form){
      var data = {
        url:"/items/create",
        method:"POST",
        data:item_form
      };

      return BaseHttpServices.getHttpService(data);
    }
  };
}])

/**
 * 获取列表项，包括热门，物品，标签，等
 */
.factory('ListServices', ['BaseHttpServices', function(BaseHttpServices) {
  return {
    //热门推荐
    getHotList: function(){
      var data = {
        method:'GET',
        url:"/showhot",
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    },
    //搜索
    search: function(keyword){
      var data = {
        method:"POST",
        url:"/search",
        data:{keyword:keyword}
      };
      return BaseHttpServices.getHttpService(data);
    },
  };
}])
/**
 * 上传图片服务
 */
.factory('uploadPicServices',['BaseHttpServices',function(BaseHttpServices){
  return {
    //上传图片,url请求路径，file为formdata
    uploadPic: function(url,file){
      var data = {
        method:"POST",
        url:url,
        data:file,
        headers:{
          "Content-Type":undefined,
          "transforRequest":angular.identity
        }
      };
      return BaseHttpServices.getHttpService(data);
    },
    showPic: function(){
      var data = {
        method:"GET",
        url:"/upload/item/showpic",
        data:null,
      }
      return BaseHttpServices.getHttpService(data);
    },
    deletePic: function(id){
      var data = {
        method:"POST",
        url:"/upload/item/deletpic",
        data:{id:id},
      }
    }
  };
}])
/**
 * 收藏服务
 */
.factory('collectionServices',['BaseHttpServices','PromiseBackServices',function(BaseHttpServices,PromiseBackServices){
  return {
    //创建收藏
    createCollection : function(item_id){
      var data = {
        method:"POST",
        url:"/items/" + item_id + "/collect",
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    },
    //删除收藏
    deleteCollection : function(item_id){
      var data = {
        method:"POST",
        url:"/items/" + item_id + "/de_collect" ,
        data:{item_id:item_id}
      };
      return BaseHttpServices.getHttpService(data);
    },
    //获取收藏
    getCollections: function(user_name){
      var data = {
        method:"GET",
        url:"/user/" + user_name + "/collections",
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    },
    hasCollected: function(item_id){
      var data = {
        method: "GET",
        url: "/items/"  + item_id + "/collected",
        data: null
      };
      return BaseHttpServices.getHttpService(data);
    }
  };
}])

/**
 * 获取验证图片
 */
.factory('getVpicServices',['BaseHttpServices',function(BaseHttpServices){
  return {
    checkPic:function(url){
      var data = {
        url: url,
        method:'GET',
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    },
  };
}])

/**
 * 获取用户信息
 */
.factory('getUserInfomationServices',['BaseHttpServices',function(BaseHttpServices){
  return {
    //获取用户详细信息
    getUserDetail: function(login_name){
      var data = {
        url: '/user/' + login_name +'/settings',
        method:'POST',
        data:{login_name:login_name}
      };
      return BaseHttpServices.getHttpService(data);
    },
    getUserProfile: function(login_name){
      var data = {
        url: '/user/',
        method:'GET',
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    },
    getUserPulished: function(login_name){
      var data = {
        url:'/user/' + login_name + '/published',
        method:"GET",
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    }
  };
}])

/**
 * 更新用户信息
 */
.factory('updateUserInformationServices',['BaseHttpServices',function(BaseHttpServices){
  return {
    updateUserInformation: function(user_data_form){
      var data = {
        method:"POST",
        url:"/update",
        data:user_data_form
      };
      return BaseHttpServices.getHttpService(data);
    }
  };
}])
/**
 * 获取全局缺省值,如分页数据量,网站名称
 */
.factory('constServices',['$cookies','$rootScope','BaseHttpServices',function($cookies,$rootScope,BaseHttpServices){
  if(!$rootScope.global){
    $rootScope.global = {};
  }
  return {

    //提供列表常量
    getNav_bottoms: function(){
      var navs_bottoms = [{
        name: "主页",
        url:"/home",
        classname:"icon-juxing121",
      },{
        name:"学校",
        url:'/school',
        classname:"icon-zhuye03"
      },{
        name:"消息",
        url:"/messages",
        classname:"icon-time2"
      },{
        name:"用户中心",
        url:"/person",
        classname:"icon-person1"
      }];

      return navs_bottoms;
    },

    //提供全局配置常量
    getConfig: function(){
      var config = {
        "site_logo":$rootScope.global.site_logo = "site_log.jpg",
        "page_limit":5,
        "pic_size":{
          "height":"300px",
          "width":"200px",
        },
        "site_name":$rootScope.global.site_name = "INeeding",
        "QiXian":30 * 1000 * 60 * 60 * 24 , //30 天
        "pic_size_limit":"2MB",
        "email":"INeeding@qq.com",
        "encryt":{                           //加密
          "crypto_string":"welcome INeeding",
          "method":"md5",
        },
        "site_description":"欢迎来到INeeding社区",
      };

      return config;
    },

    getStatus: function(){
      var data = {};
      var site_cookie = $cookies.get("INeeding");
      var login_status = $rootScope.global.has_login = site_cookie ? true:false;

      BaseHttpServices.getHttpService({
        url:'/user/',
        method:"GET",
        data:null
      }).then(function(res){
        if(res.data.code > 0 ){
          $rootScope.global.login_name = res.data.msg.login_name;
          $rootScope.global.new_message = false;
        } else {
          console.log('done');
        }
      },function(){
        mui.toast("错误");
      });

      data.global = {
        "has_login":login_status
      };

      return data;
    },

    //获取8个分类图片
    getfilter:function(){
      var content = [{
        "image_url":"images/04.png",
        "title":"搞机",
        "filter":"手机"
      },{
        "image_url":"images/05.png",
        "title":"生活",
        "filter":"生活"
      },{
        "image_url":"images/06.png",
        "title":"学习",
        "filter":"学习"
      },{
        "image_url":"images/07.png",
        "title":"数码",
        "filter":"数码"
      },{
        "image_url":"images/08.png",
        "title":"出行",
        "filter":"出行"
      },{
        "image_url":"images/09.png",
        "title":"时尚",
        "filter":"时尚"
      },{
        "image_url":"images/010.png",
        "title":"运动",
        "filter":"运动"
      },{
        "image_url":"images/011.png",
        "title":"其他",
        "filter":"其他"
      }];
      return content;
    },

    //提供视图路径
    getView: function(){
      var view = {
        hot_list:'tpl/hot_list.html',
        filter_list:'tpl/filter.html',
      };

      return view;
    },
  };
}])

/**
 * 公共工具方法
 */
.factory("CommonServices",['$rootScope',function($rootScope){
  return {

    changeStatus: function(global){
      for(var pro in global){
        $rootScope.global[pro] = global[pro];
      }
    },
    EtoC: function(english){
      var data = {
        "login_name"       :"昵称",
        "password"         :"密码",
        "name"             :"姓名",
        "user_name"        :"用户姓名",
        "school"           :"学校",
        "signature"        :"签名",
        "email"            :"邮箱",
        "qq_number"        :"qq号码",
        "phone_number"     :"手机号",
        "address"          :"地址",
        "gender"           :"性别",
        "location"         :"地址",
        "student_number"   :"学号",
        "experence"        :"经验",
      };
      return data[english];
    }

  };
}])
/**
 * 获取系统消息
 */
.factory('MessageServices',['BaseHttpServices',function(BaseHttpServices){
  return {
    getMessage: function(){
      var data = {
        url:'/my/messages',
        method:"GET",
        data:null
      };
      return BaseHttpServices.getHttpService(data);
    },
    sendMessage: function(message_form){
      var data = {
        url:"/messages/send",
        method:"POST",
        data:message_form
      };

      return BaseHttpServices.getHttpService(data);
    },
    deleteMessage: function(message_id){
      var data = {
        url:"/messages/" + message_id + "/delete",
        method:"POST",
        data:{message_id:message_id}
      };
      return BaseHttpServices.getHttpService(data);
    },

  };
}])

/**
 * 拦截器部分服务
 */

.factory('InterceptorServices',['$q','$rootScope', function($q,$rootScope){

  return {
    request: function(config){
      return config;
    },
    requestError: function(rejection){
      return $q.reject(rejection);
    },
    response: function(response){
      return response;
    },
    responseError: function(rejection){
      return $q.reject(rejection);
    }
  };
}])

/**
* 即时消息部分
*/
.factory('socket', ['$rootScope',function($rootScope){
  var socket = io.connect('http://localhost:3000');
  return {

    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };

}]);
