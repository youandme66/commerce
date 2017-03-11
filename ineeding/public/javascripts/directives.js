angular.module('directives',[])

//字符串比较
.directive('compare',function(){
	var o = {};
	o.strict = 'AE';
	o.scope={
		orgText :'=compare'
	};
	o.require='ngModel';
	o.link=function(sco,ele,att,con){
		con.$validators.compare=function(v){
			return v==sco.orgText;
		};
		sco.$watch('orgText',function(){
			con.$validate();
		});
	};
	return o;
})

.directive('uploadDirective',['$rootScope','uploadPicServices',function($rootScope,uploadPicServices){
  return {
    restrict: 'A',
    scope: {
      handler:'&'
    },
    link: function(scope, element, attr){
      element.bind('change',function(){
        var formData = new FormData();
        formData.append('upload_name',element[0].files[0]);
        var url = "/upload/item";
        if(element.hasClass("personal_image")){
          url = "/upload/user";
        }
        if(element.hasClass("identify_image")){
          url = "/upload/identify";
        }
        uploadPicServices.uploadPic(url,formData).then(function(res){
          if(res.data.code > 0){
            scope.handler();
            mui.toast(res.data.msg);
          } else {
            mui.toast(res.data.msg);
          }
        },function(){
          mui.toast("网络错误");
        });
      });
    }
  };
}])

.directive('changeAuthen',['AuthenServices',function(AuthenServices){
  return {
    restrict:'A',
    scope:{
     handler:"&"
    },
    link: function(scope, element, attr){
      element.on('click',function(){
        scope.handler();
      });
    }
  };
}]);
