var config      = require('../config');
var User        = require('../proxys/user');
var Message     = require('../proxys/message');
var eventproxy  = require('eventproxy');
var validator   = require('validator');
var Item        = require('../proxys/item');
var _           = require('lodash');

/**
 * 展示主页
 */
exports.index = function (req, res, next) {
  res.render('index');
};
/**
 * 搜索功能
 * 在title和content中模糊查找
 *
 * @param keyword  关键词
 * @msg {Array}  搜索结果
 */
exports.search = function(req, res, next){
  var keyword  = validator.trim(req.body.keyword);
  var ep       = new eventproxy();

  ep.fail(next);

  //检查关键词--start--
  if(!keyword){
    return res.json({
      code:-20,
      msg:'关键词不能为空'
    });
  }
  if(keyword.length < 1){
    return res.json({
      code:-20,
      msg:'关键词长度太短'
    });
  }

  //以空格提取关键词
  var KwArrayOrigin = keyword.split(' ');
  var KwArray = [];

  //去掉空格
  for(var i=0;i<KwArrayOrigin.length;i++){
    if(KwArrayOrigin[i] !== ''){
      KwArray.push(KwArrayOrigin[i]);
    }
  }

  for(i=0;i<KwArray.length;i++){
    if(KwArray[i].length < 2){
      return res.json({
        code:-20,
        msg:'关键词不能少于2个字符'
      });
    }
  }
  if(KwArray.length > 6){
    return res.json({
      code:-20,
      msg:"关键词不能太多"
    });
  }
  //检查关键词--end--

  //返回搜索结果
  ep.all('return searchResult',function(result){
    var searchResult = result || '';
    if(searchResult.length === 0){
      return res.json({
        code:-20,
        msg:"结果不存在"
      });
    }
    return res.json({
      code:10,
      msg:searchResult
    });
  });

  var flag = 0;
  var search = [];
  var search_query = function(){
    var query = {
      $or:[{
        title:new RegExp(KwArray[flag])
      },{
        description:new RegExp(KwArray[flag])
      }]
    };
    Item.getItemsByQuery(query,function(err,items){
      if(err){
        return next(err);
      }
      for(var i = 0; i< items.length;i++){
        search.push(items[i]);
      }
      if(flag < KwArray.length){
        flag++;
        if(flag === KwArray.length){
          return ep.emit("return searchResult",search);
        }
        search_query();
      }
    });
  };
  search_query();
};

/**
 * 展示管理界面
 */
exports.showAdmin = function(req, res, next){
  res.render('admin');
};
