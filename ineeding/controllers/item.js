 var Item       = require('../proxys').Item;
var Collection = require('../proxys').Collection;
var Message    = require('../proxys').Message;
var User       = require('../proxys').User;

var eventproxy = require('eventproxy');
var validator  = require('validator');
var multer     = require('multer');
var config     = require('../config');
var gm         = require('gm').subClass({imageMagick:true});
var tools      = require('../tools/tools');
var fs         = require('fs');

var customStorage = require('../common/customStorage');
/**
 * 显示 物品/服务主页
 */
exports.index   = function (req, res, next) {
  var filter    = validator.trim(req.body.filter);       //种类
  var is_need   = validator.trim(req.body.is_need);      //是否是需求
  var latest_id = validator.trim(req.body.latest_id);    //最后一个item_id
  var page      = validator.trim(req.body.page);         //翻页方式,前翻,后翻

  /*区分是否是服务*/
  if(!filter){
    filter = '生活';//默认显示生活产品
  }
  if(is_need !== 'true'){
    is_need = false;//默认不是需求，而是发布(物品)
  }

  var opt = {
    limit:config.item_limit,
    sort:{
      "create_at":-1
    }
  };

  var query  = {
    "filter":filter,
    "is_need":is_need,
  };

  switch(page){
    case "next_page":
      query._id = {
        "$lt":latest_id,
      };
      break;
    case "pre_page":
      query._id = {
        "$gt":latest_id
      };
      break;
    default:
      break;
  }
  Item.getItemsByFilter(query,opt,function(err,items){
    if(err){
      return next(err);
    }
    if(items.length === 0){
      return res.json({
        code:-20,
        msg:"没有数据"
      });
    }
    var items_obj = [];
    for (var i = 0; i < items.length; i++) {
      items_obj[i] = {
        _id : items[i]._id,
        price: items[i].price,
        image_url: items[i].image_url,
        valid_time: items[i].valid_time,
        create_at: items[i].create_at,
        is_need: items[i].is_need,
        description: items[i].description,
        handle: items[i].handle,
        author_id: items[i].author_id,
        title: items[i].title,
        filter: items[i].filter,
      };
    }
    return res.json({
      code: 10,
      msg:items_obj
    });
  });
};

/**
 * 创建 物品/服务信息
 */
exports.create = function(req,res,next){
  var title           = validator.trim(req.body.title);                             //发布的标题。
  var description     = validator.trim(req.body.description);                       //描述
  var handle          = validator.trim(req.body.handle);                            //抛售方式
  var price           = validator.trim(req.body.price);                             //价格
  var is_need         = req.body.is_need;                                           //是否是需求
  var filter          = validator.trim(req.body.filter);                            //分类
  var image_url       = req.session.images;                                         //从session中取缓存的image_url
  var author_id       = req.session.user._id;                                       //登录的用户ID
  var phone_number    = req.body.phone_number || req.session.user.phone_number;     //电话号码

  var ep              = new eventproxy();

  ep.fail(next);

  ep.on('create_error',function(msg){
    return res.json({
      code:-30,
      msg:msg
    });
  });
  /*验证数据正确性*/
  if(!is_need){
    is_need = false;
  }
  if(is_need){
    return ep.emit('create_error','请选择发布需求');
  }
  if(!author_id || !phone_number){
    return ep.emit('create_error','请登录后操作');
  }
  if([title, description, handle, price].some(function(items){
    return items === '';
  })){
    return ep.emit('create_error',"请将信息填写完整");
  }
  if(title.length < 3||description.length < 3){
    return ep.emit('create_error',"标题和描述不能少于3个字符");
  }
  if(!handle){
    return ep.emit('create_error',"请选择合适的处理方式");
  }
  var bool = tools.isdigit(price,".");
  if(!bool){
    return ep.emit('create_error',"请输入合适的金额");
  }
  if(parseFloat(price) > 10000 || price.length < 0 ){
    return ep.emit('create_error',"请输入合适的金额");
  }
  /*验证数据正确性*/

  var saveItem = {
    title        : title,
    image_url    : image_url,
    author_id    : author_id,
    filter       : filter,
    description  : description,
    phone_number : phone_number,
    is_need      : is_need,
    handle       : handle,
    price        : parseFloat(price),
  };
  //存储item
  ep.all('publish',function(saveItem){
    req.session.images = [];
    Item.saveItem(saveItem,ep.done(function(msg){
      res.status(200);
      return res.json({
        code:10,
        msg:"发布成功"
      });
    }));
  });

  var query = {
    author_id : author_id,
    title     : title
  };
  Item.getItemByQuery(query, ep.done(function(item){
    /**
     * item为对象
     */
    if(!item.title){
      return ep.emit('publish',saveItem);
    }
    ep.emit('create_error','所创建物品已经存在');
  }));
};

/**
 * 更新 goods/services
 */
exports.update = function(req, res, next) {
  var title = validator.trim(req.body.title);
  var item_id = validator.trim(req.body.item_id);
  var author_id = validator.trim(req.session.user._id) || '';
  var description = validator.trim(req.body.description);
  var is_need = req.body.is_need;
  var handle = validator.trim(req.body.handle);
  var item_status = validator.trim(req.body.item_status) || '';
  var filter = validator.trim(req.body.filter) || '';
  var price = req.body.price;
  var phone_number = validator.trim(req.body.phone_number) || '';
  var image_url = validator.trim(req.session.images) || '';

  var items = {
    title: title,
    item_id: item_id,
    author_id: author_id,
    filter: filter,
    description: description,
    phone_number: phone_number,
    is_need: is_need,
    handle: handle,
    price: price,
    image_url: image_url
  };
  if ([item_id, author_id, description, item_status, filter].some(function(obj) {
    return obj === '';
  })) {
    return res.json({
      msg: "请填写将项目完整"
    });
  }

  Item.getItemById(item_id, function(err, item) {
    if (err) {
      return res.json({
        msg: "服务器错误"
      });
    }
    item._id = items.item_id;
    item.phone_number = items.phone_number;
    item.save(function(err){
      if(err){

      }
    });

  });
};

/**
 * 删除 goods/services
 */
exports.delete = function(req,res,next){
  var item_id = req.params.id || req.body.id;        //所要删除的item
  var author_id = req.session.user._id;              //user_id

  Item.getItemById(item_id,function(err, item){
    if(err){
      return next(err);
    }
    if(!item){
      return res.json({
        msg:"找不到这个物品,请核实"
      });
    }
    item.deleted = true;
    item.save(function(err){
      if(err){
        return res.json({err:"删除失败"});
      }
      res.json({
        code:10,
        msg:"删除成功"
      });
    });
  });
};

/**
 * 改变锁定状态 goods/services
 */
exports.changeBlock = function(req,res,next){
  var item_id = req.params.item_id;
  var author_id = req.session.user.user_id;

  if(!author_id.is_admin){
    return res.json({
      msg:"抱歉,没有权限设置"
    });
  } else {
  }
};


/**
 * 显示详情 goods/services
 */
exports.showDetail = function(req,res,next){
  var item_id   = req.params.id || '';
  var user      = req.session.user ||'';
  var ep        = new eventproxy();

  if(!user){
    return res.json({
      code:-20,
      msg:"用户请登录"
    });
  }

  ep.all("getUser","getItem",function(user,item){
    if(!item){
      return res.json({
        code:-20,
        msg:"没找到数据"
      });
    }
    if(!req.session.user.authened){
      item.phone_number = '';
    }
    var item_obj = {
      title:         item.title,
      create_at:     item.create_at,
      author_id:     item.author_id,
      filter:        item.filter,
      phone_number:  item.phone_number,
      description:   item.description,
      handle:        item.handle,
      is_need:       item.is_need,
      price:         item.price,
      image_url:     item.image_url,
      blocked:       item.blocked,
      deleted:       item.deleted,
      author_login_name       : user.login_name,
      author_profile_image_url: user.profile_image_url,
    };
    return res.json({
      code:10,
      msg:item_obj
    });
  });
  ep.all("getItem",function(item){
    var user_id = item.author_id;
    User.getUserById(user_id,function(err,user){
      if(err){
        return next(err);
      }
      if(!user){
        item.blocked = true; 
        item.save(function(err){
          if(err){
            return next(err);
          }
        });
        return res.json({
          code:-60,
          msg:"没有找到用户信息,或用户已被锁定"
        });
      }

      ep.emit("getUser",user);
    });
  });
  Item.getItemById(item_id,function(err,item){
    if(err){
      return next(err);
    }
    if(!item){
      return res.json({
        code: -10,
        msg:"未找到此相关信息"
      });
    }
    if(!item.author_id){
      return res.json({
        code:-20,
        msg:"未找到此相关信息"
      });
    } else {
      ep.emit("getItem",item);
    }
  });
};

/**
 * 收藏 goods/services
 */
exports.collect = function(req, res, next){
  var item_id   = req.params.id || req.body.id;
  var user_id   = req.session.user._id;
  var is_admin  = req.session.user.is_admin;
  var ep        = new eventproxy();

  ep.fail(next);

  Item.getItemById(item_id,function(err,item){
    if(err){
      return next(err);
    }
    if(!item){
      return res.json({
        code:-20,
        msg:"不存在或已被删除"
      });
    }

    Collection.getCollectionById(user_id,item_id,function(err,collection){
      if(err){
        return next(err);
      }

      if(item.author_id.id === user_id.id){
        return res.json({
          code:-20,
          msg:"不能自己收藏自己的哦"
        });
      }
      if(collection){
        return res.json({
          code:-20,
          msg:"不能重复收藏"
        });
      } else {
        ep.on("Increase experence",function(){
          User.getUserById(item.author_id,ep.done(function(user){
            //发布item的人经验值增加
            user.experence += 3;
            user.save(function(err){
              if(err){
                return next(err);
              }
              res.end();
            });
          }));
        });
        var data = {
          user_id : user_id,
          item_id:item_id,
          item_handle:item.handle,
          item_title:item.title,
          item_price:item.price,
          item_image_url:item.image_url
        };
        Collection.saveCollection(data,function(err){
          if(err){
            return next(err);
          }
          //改变item被收藏次数
          Item.changeCollecteCount(item._id,true,function(err){
            if(err){
              return next(err);
            }
          });
          res.json({
            code:10,
            msg: "收藏成功"
          });
          ep.emit("Increase experence");
        });
      }
    });
  });
};

/**
 * 取消收藏 goods/services
 */
exports.de_collect = function(req, res, next){
  var item_id = req.params.id || '';
  var user_id = req.session.user._id;
  var ep      = new eventproxy();

  ep.fail(next);

  if(!item_id){
    return res.json({
      code:-81,
      msg:"信息不完整"
    });
  }
  if(!user_id){
    return res.json({
      code:-20,
      msg:"请登录"
    });
  }

  Item.getItemById(item_id,function(err,item){
    if(err){
      return next(err);
    }
    //原来的item已经被删除，收藏失效
    if(!item){
      Collection.deleteCollection(user_id,item_id,function(err){
        if(err){
          return next(err);
        }
        return res.json({
          code:10,
          msg:"取消收藏成功"
        });
      });
    } else {
      User.getUserById(item.author_id,function(err,user){
        if(err){
          return next(err);
        }
        ep.on("changeCollecteCount",function(item_id){
          Item.changeCollecteCount(item._id,false,function(err){
            if(err){
              return next(err);
            }
            ep.emit("decrease experence");
          });
        });

        ep.on("decrease experence",function(){
          if(user.experence > 3){
            user.experence -= 3;
          }
          user.save(function(err){
            if(err){
              return next(err);
            }
            return res.json({
              code:10,
              msg:"取消收藏成功"
            });
          });
        });

        Collection.deleteCollection(user_id,item_id,function(err){
          if(err){
            return next(err);
          }
          ep.emit("changeCollecteCount",item_id);
        });

      });
    }
  });
};


/**
 * 图片上传
 */
exports.upload = function(req, res, next) {
  var images = req.session.images;
  if(images.length > 2){
    return res.json({
      code:-20,
      msg:"抱歉,仅允许上传3张图片"
    });
  }
  var storage = customStorage({
    "destination" : function (req, file, callback) {
      var user_id    = req.session.user._id;
      var id         = req.params.id;
      var cwd        = process.cwd();
      var upload_dir = cwd + '/public/uploads/';
      var rel_dir    = '/uploads/';
      var ep         = new eventproxy();

      ep.fail(next);
      
      //如果为item,则创建随机文件名，否则使用user_id
      if(id !== "user"){
        id = tools.hashString();
      } else {
        id = user_id;
      }
      var user_dir = upload_dir + user_id + "/";
      //随机文件名ext为后缀
      var getRandomFileName = function(id,ext){
        var rand = Math.floor(Math.random(Math.random())*100);
        var name =  rand + id + ext;
        return name;
      };
      var name = getRandomFileName(id,".jpg");
      ep.on("callback upload",function(name){
        callback(null,upload_dir + user_id + "/" + name);
      });
      //如果文件夹存在则不创建
      if (fs.existsSync(user_dir)) {
        req.session.images.push(rel_dir + user_id + "/" + name);
        ep.emit("callback upload",name);
      } else {
        fs.mkdir(upload_dir + user_id + "/",function(err){
          if(err){
            console.log(err);
          }
          req.session.images.push(rel_dir + user_id + '/' + name );
          ep.emit("callback upload",name);
        });
      }
    }
  });

  var uploads = multer({
    "storage" : storage
  }).single('upload_name');

  uploads(req, res,function(err){
    if(err){
      return next(err);
    }
    var user_id    = req.session.user._id;
    var login_name = req.session.user.login_name;
    var id         = validator.trim(req.params.id);
    var ep         = new eventproxy();
    //用户更换头像
    if(id === "user"){
      return User.getUserById(user_id,function(err,user){
        if(err){
          return next(err);
        }
        user.profile_image_url = req.session.images[0];
        user.save(function(err){
          if(err){
            return next(err);
          }
          req.session.images = [];
          res.json({
            code:10,
            msg:"更新成功"
          });
          res.end();
        });
      });
    }

    return res.json({
      code:10,
      msg:"上传图片成功"
    });
  });

};

/**
 * 收藏
 */
exports.collected = function(req, res, next){
  var item_id = req.params.id || req.body.item_id;
  var user_id = req.session.user._id ;

  if(!item_id){
    return res.json({
      code:-20,
      msg:"id不能为空"
    });
  }
  if(!user_id){
    return res.json({
      code:-20,
      msg:"请先登录"
    });
  }
  Collection.getCollectionById(user_id,item_id,function(err,collection){
    if(err){
      return next(err);
    }
    if(!collection || collection.length === 1){
      return res.json({
        coed:-20,
        msg:"未找到数据"
      });
    } else {
      return res.json({
        code:10,
        msg:"已经收藏了",
      });
    }
  });
};


/**
 * 设定是否是热门
 */
exports.setHot = function(req, res, next){
  var item_id = req.params.item_id;
  var setHot = req.query.setHot;//Boolean

};

/**
 * 展示精品推荐
 */
exports.showHot = function(req, res, next){
  var query = {
    collected_count:{
      "$gt":4
    }
  };
  var opt = {
    limit:4,
    sort:{
      "_id":-1
    }
  };
  Item.getItemsByQuery(query,opt,function(err,items){
    if(err){
      return next(err);
    }
    if(!items || items.length === 0){
      return res.json({
        code:-20,
        msg:"没有数据"
      });
    }
    var arr = [];
    for(var i=0;i<items.length;i++){
      var item_obj = items[i]._doc;
      var item_new = tools.hideInformation(item_obj);
      arr.push(item_new);
    }
    return res.json({
      code:10,
      msg:arr
    });
  });
};

/**
 * 显示上传图片
 */
exports.showUploadPic = function(req, res, next){
  var img = req.session.images;
  return res.json({
    code:10,
    msg:img
  });
};

/**
 * 删除上传图片
 */
exports.deleteUploadPic = function(req, res, next){
  var id  = validator.trim(req.body.id);
  var arr = req.session.images;
  arr[id] = "";
  arr.filter(function(element){
    if(!element){
      return;
    } else {
      return element;
    }
  });
}
