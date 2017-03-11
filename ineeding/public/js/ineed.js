/**
 * 图片轮播
 */
mui.init({
  swipeBack:true //启用右滑关闭功能
});
var slider = mui('#slider');
slider.slider({
  interval:1000
});

/*收藏功能*/
mui.init({
	swipeBack: true //启用右滑关闭功能
});
var oImg=document.getElementById("pic");
var onOff=true;	
oImg.onclick=function(){
	if(onOff){			
		mui.alert('收藏成功！');
		oImg.src="images/016.png";
		onOff=false;	
	}
	else{
		oImg.src="images/018.png";
		mui.alert('取消收藏！');
		onOff=true;			
	}	
};
/*退出登录*/
mui.init({
	swipeBack: true //启用右滑关闭功能
});

var quit = document.getElementById("quit-log");
quit.addEventListener('tap', function() {				
	mui.confirm("确定要退出？");
});
/*认证相关*/
/*删除*/
(function($) {
$('#OA_task_1').on('tap', '.mui-btn', function(event) {
	var elem = this;
	var li = elem.parentNode.parentNode;
	mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
		if (e.index == 0) {
			li.parentNode.removeChild(li);
		} else {
			setTimeout(function() {
				$.swipeoutClose(li);
			}, 0);
		}
	});
});
var btnArray = ['确认', '取消'];
//第二个demo，向左拖拽后显示操作图标，释放后自动触发的业务逻辑
$('#OA_task_2').on('slideleft', '.mui-table-view-cell', function(event) {
	var elem = this;
	mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
		if (e.index == 0) {
			elem.parentNode.removeChild(elem);
		} else {
			setTimeout(function() {
				$.swipeoutClose(elem);
			}, 0);
		}
	});
});
//第二个demo，向右拖拽后显示操作图标，释放后自动触发的业务逻辑
$('#OA_task_2').on('slideright', '.mui-table-view-cell', function(event) {
	var elem = this;
	mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
			if (e.index == 0) {
				elem.parentNode.removeChild(elem);
			} else {
				setTimeout(function() {
					$.swipeoutClose(elem);
				}, 0);
			}
		});
	});
})(mui);
