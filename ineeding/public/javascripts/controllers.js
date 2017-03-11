angular.module('controllers', [
    'ngRoute',
])

/**
 * 主页控制器
 */
.controller('HomeController', ['$scope','$rootScope','$location','CommonServices','constServices','ListServices','socket',function($scope,$rootScope,$location,CommonServices,constServices,ListServices,socket){
  //init page status
  var navs_bottoms = constServices.getNav_bottoms();
  $scope.hot_list = constServices.getView().hot_list;
  $scope.data = {};
  $scope.home = {
    navs_bottoms:navs_bottoms,
  };
  //define function
  $scope.search_enter = function(){
    $location.path('/search');
  };

  $scope.show_search = function(){
    $rootScope.global.show_search = true;
    $rootScope.global.show_header = false;
  };
  $scope.hide_search = function(){
    $rootScope.global.show_search = false;
    $rootScope.global.show_header = true;
  };

  var global = {
    "show_nav_top" : true,
    "show_nav" : true,
    "show_header" : true,
    "show_slider":true,
    "show_next_page":false,
  };

  var init = (function(){
    CommonServices.changeStatus(global);  
    constServices.getStatus();  
    constServices.getConfig();  
  })();

}])

/**
 * 个人中心控制器
 */
.controller('PersonController', ['$scope', '$rootScope','$timeout','AuthenServices','constServices','getUserInfomationServices','CommonServices',function($scope, $rootScope,$timeout,AuthenServices,constServices,getUserInfomationServices,CommonServices){
  //切换页面状态
  var global = {
    show_nav: false,
    show_header:true,
    has_login:constServices.getStatus().global.has_login
  };
  CommonServices.changeStatus(global);

  //获取用户信息
  var updateInfo = function(){
    if($rootScope.global.has_login){
      getUserInfomationServices.getUserProfile().then(function(res){
        if(res.data.code < 0){
          mui.toast(res.data.msg);
        } else {
          $scope.user = res.data.msg;
          $rootScope.global.login_name = res.data.msg.login_name;
        }
      },function(){
        mui.toast('未知错误');
      });
    }
  };
  updateInfo();

  $scope.updateUserImage = function(){
    console.log("updateUserImage called");
    updateInfo();
  };

  $scope.exit = function(){
    AuthenServices.signout().then(function(res){
      if(res.data.code > 0){
        mui.toast(res.data.msg);
        $rootScope.global.has_login = false;
        $scope.user = {};
      } else {
        mui.toast("操作失败");
      }
    },function(){
      mui.toast("错误");
    });
  };


}])

/**
 * 信息展示页
 */
.controller('PerinfoController', ['$scope','$rootScope','getUserInfomationServices','CommonServices',function($scope,$rootScope,getUserInfomationServices,CommonServices){
  var global = {
    show_nav_top:false,
    show_nav: false
  };
  CommonServices.changeStatus(global);

  getUserInfomationServices.getUserDetail($rootScope.global.login_name).then(function(res){
    if(res.data.code > 0){
      $scope.user = res.data.msg;
    } else {
      mui.toast(res.data.msg);
    }
  },function(){
    mui.toast("网络错误");
  });

  $scope.changeAuthen = function(user_id,login_name){
    AuthenServices.changeAuthen(user_id,login_name).then(function(res){
      if(res.data.code > 0){
        mui.toast(res.data.msg);
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("错误");
    });
  };

}])

/**
 * 分类控制器
 */
.controller('FilterController',['$scope','constServices',function($scope,constServices){
  var filter_view = constServices.getView();
  $scope.filter =filter_view.filter_list;
  $scope.items = constServices.getfilter();
}])

/**
 * 热门控制器
 */
.controller('HotController',['$scope','ListServices',function($scope, ListServices){
  $scope.items = {};
  ListServices.getHotList().then(function(res){
    if(res.data.code > 0){
      $scope.items = res.data.msg;
    } else {
      console.log(res.data.msg);
    }
  },function(res){
    mui.toast("网络错误");
  });
}])


/**
 * 登录控制器
 */
.controller('LoginController',['$scope','$timeout','$rootScope','$location','AuthenServices','CommonServices',function($scope,$timeout,$rootScope,$location,AuthenServices,CommonServices){
  var global = {
    show_slider:false,
    show_search:false,
    show_nav:false,
    show_nav_top:false,
  };

  CommonServices.changeStatus(global);
  var userdata = {};
  $scope.login = function(){
    AuthenServices.login($scope.userdata).then(function(res){
      if(res.data.code > 0){
        $rootScope.global.has_login = true;
        mui.toast('登录成功');
        $timeout(function(){
          $location.path('/home');
        },2000);
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("操作失败");
    });
  };

}])

/**
 * 注册控制器
 */
.controller('RegController',['$scope','$location','$timeout','getVpicServices','AuthenServices',function($scope,$location,$timeout,getVpicServices,AuthenServices){
  var regdata = {};
  $scope.src = {
    vpic:"/getpic/one"
  };
  $scope.changePic = function(){
    var img_link = "/getpic/" + Math.floor(Math.random()*100);
    getVpicServices.checkPic(img_link).then(function(res){
      $scope.src = {
        vpic:img_link
      };
    },function(res){
      mui.toast("获取失败");
    });
  };

  $scope.signup = function(){

    AuthenServices.signup($scope.regdata).then(function(res){
      if(res.data.code < 0 ){
        mui.toast(res.data.msg);
      } else {
        mui.toast("注册成功");
        $timeout(function(){
          $location.path('/login');
        },2000);
      }
    },function(res){
      mui.toast("操作失败");
    });
  };
}])

/**
 * 用户详细信息页，可修改页。
 */
.controller('PerMessageController',['$scope','$rootScope','CommonServices','getUserInfomationServices','AuthenServices',function($scope,$rootScope,CommonServices,getUserInfomationServices,AuthenServices){
  var global = {
    show_slider:false,
    show_nav:false,
  };
  CommonServices.changeStatus(global);

  getUserInfomationServices.getUserDetail($rootScope.global.login_name).then(function(res){
    if(res.data.code > 0){
      $scope.user = res.data.msg;
    } else {
      mui.toast(res.data.msg);
    }
  },function(){
    mui.toast("网络错误");
  });

}])



//认证，修改姓名，修改密码控制器
.controller('ModifyController',['$scope','$rootScope','$location','$timeout','$route','updateUserInformationServices','CommonServices',function($scope,$rootScope,$location,$timeout,$route,updateUserInformationServices,CommonServices){

  var user_data_form = $scope.user_data_form = {};
  var info = $route.current.params.id;
  $scope.modifier = {
    name:CommonServices.EtoC(info)
  };

  if(info === "gender"){
    $scope.modifier = {
      select:true,
    };
  }

  $scope.changeInfo = function(){
    user_data_form[info] = $scope.user_data_form.name;

    if(!user_data_form){
      return mui.toast("不能为空");
    }

    updateUserInformationServices.updateUserInformation(user_data_form).then(function(res){
      if(res.data.code >0){
        mui.toast(res.data.msg);
        $rootScope.global.login_name = user_data_form.login_name || $rootScope.global.login_name;
        $timeout(function(){
          $location.path("/permessage");
        },2000);
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("网络错误");
    });
  };
}])

.controller('NewPasswordController',['$scope','$rootScope','$timeout','$location','AuthenServices',function($scope,$rootScope,$timeout,$location,AuthenServices){

  if(!$rootScope.global.has_login) {
    $scope.items = {};
    mui.toast("请先登录");
    $timeout(function(){
      $location.path('/login');
    },2000);
  }

  var newpassdata = {};
  $scope.updatePass = function(){
    newpassdata = $scope.newpassdata;
    AuthenServices.updatePass(newpassdata).then(function(res){
      if(res.data.code < 0){
        return mui.toast(res.data.msg);
      }
      mui.toast('修改成功！');
      $location.path('/perMessage');
    },function(){
      mui.toast("修改失败");
    });
  };

}])
.controller('IdentifyController',['$scope','$timeout','$location','AuthenServices','CommonServices',function($scope,$timeout,$location,AuthenServices,CommonServices){
  var global = {
    "show_nav":false
  };

  CommonServices.changeStatus(global);

  var indetify_form = {};
  $scope.identify = function(){
    identify_form = $scope.identify_form;
    AuthenServices.identify(identify_form).then(function(res){
      if(res.data.code >0){
        $timeout(function(){
          $location.path('/perMessage');
        },2000);
        mui.toast(res.data.msg);
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("网络错误");
    });
  };

}])

//详情信息控制器
.controller('InformationController',['$scope','$rootScope','$route','$timeout','$location','itemServices','CommonServices','collectionServices',function($scope,$rootScope,$route,$timeout,$location,itemServices,CommonServices,collectionServices){
  //页面状态
  var pageStatus = function(){
    var global = {
      show_nav:true,
      show_nav_top:false,
      show_slider:false
    };
    CommonServices.changeStatus(global);
    $scope.items_user = "tpl/items_user.html";
  };

  var item_id = $route.current.params.id;
  //取详细数据
  var getData = function(){
    $scope.items = {};
    itemServices.showItem(item_id).then(function(res){
      if(res.data.code > 0){
        $rootScope.global.item_id = res.data.msg._id;
        $scope.item = res.data.msg;
        pageStatus();
      } else {
        mui.toast(res.data.msg);
        //判断是用户不存在还是没有登录
        if(res.data.code !== -60){
          $timeout(function(){
            $location.path('/login');
          },2000);
        }
      }
    },function(){
      mui.toast('网络故障！');
    });
  };

  //判断是否已经被收藏
  var hasCollected = function(){
    collectionServices.hasCollected(item_id).then(function(res){
      if(res.data.code > 0){
        $rootScope.global.has_collected = true ;
      } else {
        $rootScope.global.has_collected = false;
      }
    },function(res){
      mui.toast("操作失败");
    });
    getData();
  };
  hasCollected();

  //改变收藏状态
  $scope.change_collection = function(){
    if(!$rootScope.global.has_collected){
      collectionServices.createCollection(item_id).then(function(res){
        if(res.data.code > 0){
          $rootScope.global.has_collected = true;
          mui.alert(res.data.msg);
        } else {
          $rootScope.global.has_collected = false;
          mui.toast(res.data.msg);
        }
      },function(){
        mui.toast("操作失败");
      });
    } else {
      collectionServices.deleteCollection(item_id).then(function(res){
        if(res.data.code > 0){
          $rootScope.global.has_collected = false;
          mui.alert(res.data.msg);
        } else {
          mui.toast(res.data.msg);
        }
      },function(){
        mui.toast("网络错误");
      });
    }
  };

  //查看发信人的信息。
  $scope.getAuthorInformation = function(author_login_name){
    $rootScope.global.login_name = author_login_name;
    $location.path('/personal_info');
  };

  $scope.toAuth = function(){
    $location.path('/identify');
  };

}])



//搜索页面控制器
.controller('SearchController',['$scope','$rootScope','CommonServices','ListServices',function($scope,$rootScope,CommonServices,ListServices){
  var global = {
    show_nav_top:false,
    show_nav:false,
    show_slider:false
  };
  CommonServices.changeStatus(global);


  var keyword = {};
  keyword = $scope.data.keyword;
  $scope.search_enter = (function(){
    ListServices.search(keyword).then(function(res){
      if(res.data.code > 0){
        $scope.items = res.data.msg;
      } else {
        mui.toast(res.data.msg);
      }
    },function(res){
      mui.toast("网络错误");
    });
  })();

}])


//post页面控制器
.controller('PostController',['$scope','$rootScope','$location','$timeout','itemServices','CommonServices','constServices','uploadPicServices',function($scope,$rootScope,$location,$timeout,itemServices,CommonServices,constServices,uploadPicServices){
  var global = {
    "show_slider":false,
    "show_nav":false,
    "post_delete_button":true,
  };
  CommonServices.changeStatus(global);

  $scope.postdata = {};
  $scope.postdata.filter = "手机";
  $scope.postdata.handle = "出租";
  $scope.post_button = true;

  if(!$rootScope.global.has_login) {
    mui.toast("请先登录");
    $timeout(function(){
      $location.path('/login');
    },2000);
  }
  var postdata = {};
  $scope.post = function(){
    itemServices.createItem($scope.postdata).then(function(res){
      if(res.data.code > 0 ){
        mui.alert(res.data.msg);
        $location.path('/tag');
      } else{
        mui.alert(res.data.msg);
      }  
    },function(res){
      mui.toast('错误！');
    });
  };

  $scope.uploadItemImage = function(){
    uploadPicServices.showPic().then(function(res){
      if(res.data.code > 0){
        if(res.data.msg.length > 2){
          $scope.post_button = false;
        }
        $scope.images = res.data.msg;
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("错误");
    });
  };

}])


//展示控制器
.controller('ListController',['$scope','$route','$rootScope','itemServices','CommonServices',function($scope,$route,$rootScope,itemServices,CommonServices){
  var global = {
    show_nav:false,
    post_delete_button:false,
  };
  CommonServices.changeStatus(global);
  $scope.list_page = {
    title : $route.current.params.filter
  };
  //清空items,防止页面提前出现数据
  $scope.items = {};
  itemServices.getItems($route.current.params).then(function(res){
    if(res.data.code < 0){
      $rootScope.global.show_next_page = false;
      mui.toast(res.data.msg);
    } else {
      $scope.items = res.data.msg;
      $rootScope.global.latest_id = res.data.msg[res.data.msg.length - 1]._id;
      $rootScope.global.show_next_page = true;
    }
  },function(){
    mui.toast("未知错误");
  });

  //分页
  $scope.nextPage = function(){
    var query = {
      filter:$route.current.params.filter,
      latest_id:$rootScope.global.latest_id,
      page:"next_page",
    };
    itemServices.getItems(query).then(function(res){
      if(res.data.code > 0){
        $scope.items = res.data.msg;
        $rootScope.global.latest_id = res.data.msg[res.data.msg.length -1]._id;
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("未知错误");
    });
  };

  $scope.prePage = function(){
    var query = {
      filter:$route.current.params.filter,
      latest_id:$rootScope.global.latest_id,
      page:"pre_page",
    };
    itemServices.getItems(query).then(function(res){
      if(res.data.code > 0){
        if(res.data.msg.length < 5){
          $scope.items = res.data.msg;
          $rootScope.global.latest_id = res.data.msg[res.data.msg.length -1]._id;
        } else {
          mui.toast("没有数据");
        }
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("未知错误");
    });
  };

}])

//学校控制器
.controller('SchoolController',['$scope','$rootScope','CommonServices',function($scope,$rootScope,CommonServices){
  var global={
    show_nav:false,
    show_header:true
  };
  CommonServices.changeStatus(global);
}])
//消息控制器
.controller('MessageController',['$scope','$rootScope','$interval','$location','CommonServices','MessageServices','socket',function($scope,$rootScope,$interval,$location,CommonServices,MessageServices,socket){

  var global={
    show_nav:false,
    show_header:false
  };
  CommonServices.changeStatus(global);

  var getMessage = function(){
    MessageServices.getMessage().then(function(res){
      var new_count = res.data.msg.hasnot_read_messages.length;
      var new_message = new_count - $rootScope.global.message_count;
      if(res.data.code > 0){
        //$scope.items_has_read = res.data.msg.has_read_messages;
        $scope.items_hasnot_read = res.data.msg.hasnot_read_messages;
        if( new_message > 0 ){
          mui.toast("有 " + new_message + " 新条消息");
          $rootScope.global.message_count = new_count;
        } else {
          $rootScope.global.message_count = res.data.msg.hasnot_read_messages.length;
        } 
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("网络错误");
    });
  };

  getMessage();

  $scope.sendMessage = function(){
    var message_form = {};
    message_form = $scope.message_form;

    MessageServices.sendMessage(message_form).then(function(res){
      if(res.data.code > 0){
        socket.emit("send a message", message_form);
        $scope.message_form.content = '';
        mui.toast(res.data.msg);
      } else {
        mui.toast(res.data.msg);
      }
    },function(res){
      mui.toast("网络错误");
    });
  };

  $scope.deleteMessage = function(message_id){
    MessageServices.deleteMessage(message_id).then(function(res){
      if(res.data.code > 0){
        getMessage();
        mui.toast(res.data.msg);
      } else {
        mui.toast(res.data.msg);
      }
    },function(res){
      mui.toast("网络错误");
    });
  };

  $scope.refresh = function(){
    getMessage();
  };

  $scope.getAuthorInformation = function(author_login_name){
    $rootScope.global.login_name = author_login_name;
    $location.path("/personal_info");
  };

  socket.on("got a message", function(data){
    mui.alert(data);
  });

  socket.emit("login", {login_name:$rootScope.global.login_name},function(data){
    console.log(data);
  });


}])


//我的发布控制器
.controller('PublishedController',['$scope','$rootScope','$location','getUserInfomationServices','CommonServices','itemServices',function($scope,$rootScope,$location,getUserInfomationServices,CommonServices,itemServices){
  var global = {
    show_nav : false,
    show_nav_top : false,
    show_slider:false,
    post_delete_button:true,
    show_next_page:true,
  };

  CommonServices.changeStatus(global);

  var getInfomation = function(){
    $scope.items = {};
    getUserInfomationServices.getUserPulished($rootScope.global.login_name).then(function(res){
      if(res.data.code > 0){
        $scope.items = res.data.msg;
      } else {
        mui.toast(res.data.msg);
      }
    },function(res){
      mui.toast("错误");
    });
  };

  getInfomation();

  $scope.deletePost = function(item_id){
    itemServices.deleteItem(item_id).then(function(res){
      if(res.data.code > 0){
        getInfomation();
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("网络错误");
    });
  };

}])

//忘记密码控制器
.controller('ForgetController',['$scope','$timeout','$rootScope','$location','AuthenServices',function($scope,$timeout,$rootScope,$location,AuthenServices){
  var reset_pass_form = {};
  $scope.resetMessage = function(){
    reset_pass_form = $scope.forget_data;
    AuthenServices.sendMessage(reset_pass_form.phone_number).then(function(res){
      if(res.data.code > 0){
        mui.alert(res.data.msg);
      } else {
        mui.alert(res.data.msg);
      }
    },function(){
      mui.toast("网络错误");
    });
  };

  $scope.resetPass = function(){
    reset_pass_form = $scope.forget_data;
    AuthenServices.resetPass(reset_pass_form).then(function(res){
      if(res.data.code > 0){
        mui.alert(res.data.msg);
      } else {
        mui.alert(res.data.msg);
      }
    },function(res){
      mui.toast("网络错误");
    });
  };
}])

/**
 * 显示收藏列表
 */
.controller("CollectionController",['$scope','$rootScope','$timeout','$location','CommonServices','collectionServices',function($scope,$rootScope,$timeout,$location,CommonServices,collectionServices){
  var global = {
    show_nav:false,
    show_slider:false,
  };
  CommonServices.changeStatus(global);
  $scope.items = {};
  //获取用户collections
  var getUserCollections = function(){
    collectionServices.getCollections($rootScope.global.login_name).then(function(res){
      if(res.data.code > 0 ){
        $scope.items = res.data.msg;
        mui.toast("有 " + res.data.msg.length + " 条收藏");
      } else {
        $scope.items = {};
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("网络错误");
    });
  };
  getUserCollections();
  $scope.deCollect = function(item_id){
    collectionServices.deleteCollection(item_id).then(function(res){
      if(res.data.code > 0){
        $rootScope.global.has_collected = false;
        getUserCollections();
        mui.toast(res.data.msg);
      } else {
        mui.toast(res.data.msg);
      }
    },function(){
      mui.toast("网络错误");
    });
  };

}]);
