angular.module('INeeding', [
    'router'       ,
    'controllers'  ,
    'directives'   ,
    'services'     ,
    'filters'      ,
])

.config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push("InterceptorServices");
  $httpProvider.defaults.transformRequest.push(function(data){
    return data;
  });
  $httpProvider.defaults.transformResponse.push(function(data){
    return data;
  });
}])

.run(['$rootScope','$location','$q',function($rootScope,$location,$q){
  //检查user状态
  function checkUser(){
  }

  //初始化函数
  function init(){
  }
  init();

}]);
