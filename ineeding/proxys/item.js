var models=require("../models");
var Item=models.Item;
var User=require("./user");
var config=require("../config");

/**
 * 通过item_id获取item
 * @param {String} item_id
 * @param {function} callback
 */
 function getItemById(item_id,callback){
  Item.findOne({_id:item_id},callback);
 }
 function getWholeItemByItem(item,callback){
  User.getUserById(item.author_id,function(err,user){
    if(err){
      return callback(err);
    }
    item.author=user;
    callback(null,item);
  });
}
exports.getItemById=function(item_id,callback){
  Item.findOne({_id:item_id,blocked:false},callback);
};
/**
 * 根据item_id获取Item的全部信息
 *
 */
exports.getWholeItemById=function(item_id,callback){
  getItemById(item_id,function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(null,[]);
    }
    getWholeItemByItem(item,callback);
  });
};
/**
 * 根据item实体取得item里的全部属性
 * @param {Object} item item实体
 * @param {Function} callback 
 */
exports.getWholeItemByItem=function(item,callback){
  User.getUserById(item.author_id,function(err,user){
    if(err){
      return callback(err);
    }
    item.author=user;
    callback(null,item);
  });
};
/**
 * 根据关键字(tab,is_need等)搜索
 */
exports.getItems=function(query,opt,callback){
  query.deleted = false;
  Item.find(query,{},opt,function(err,items){
    if(err){
      return callback(err);
    }
    if(items.length === 0){
      return callback(null,[]);
    }
    return callback(null, items);
  });
};
/**
 * 通过filters和is_need查找items
 * @param {String} filter
 * @param {Boolean} is_need
 * @param {Object} opt 設置，默認爲創建時間排序，
 * @param {function} callback
 */
exports.getItemsByFilter=function(query,opt,callback){
  query.deleted = false;
  query.blocked = false;
  Item.find(query,'',opt,callback);
};
/**
 * 保存item
 * @param {Object} item
 *    item.title,
 *    item.author_id,
 *    item.filter,
 *    item.description,
 *    item.phone_number,
 *    item.is_need,
 *    item.handle,
 *    item.price,
 *    item.image_url
 * @param {Function} callback
 */
exports.saveItem=function(item,callback){
  var _item=new Item();
  _item.title=item.title;
  _item.author_id=item.author_id;
  _item.filter=item.filter;
  _item.description=item.description;
  _item.phone_number=item.phone_number;
  _item.is_need=item.is_need;
  _item.handle=item.handle;
  _item.price=item.price;
  _item.valid_time = new Date(new Date().getTime() + config.publish_valid_day);
  if(!item.is_need){
    _item.image_url=item.image_url;
  }
  _item.save(callback);
};
/**
 * 改变收藏次数
 * @param {String} id item.id
 * @param {boolean} flag true为增１false为减１ 
 * @param {Function} callback
 */
exports.changeCollecteCount=function(id,value,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    if(value){
      item.collected_count+=1;
    }
    else{
      item.collected_count-=1;
    }
    item.save(callback);
  });
};
/**
 * 下架或者上架 
 * @param {String} id item.id
 * @param {Boolean} blocked
 * @param {Function} callback
 */
exports.changeBlocked=function(id,blocked,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    item.blocked=blocked;
    item.save(callback);
  });

};
/**
 * 删除item,改变delete属性
 * @param {String} id item.id
 * @param {Function} callback
 */
exports.deleteItem=function(id,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    item.deleted=true;
    item.save(callback);
  });
};
/**
 * 回复次数改变 
 * @param {String} id item.id
 * @param {Boolean} flag true增１，false减１ 
 * @param {Function} callback
 */
exports.changeReplyCount=function(id,flag,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    item.reply_count+=flag?1:-1;
    item.save(callback);
  });
};
/**
 * 浏览次数改变
 * @param {String} id item.id
 * @param {Boolean} flag
 * @param {Function} callback
 */
exports.changeVisitCount=function(id,flag,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    item.visit_count+=flag?1:-1;
    item.save(callback);
  });
};
/**
 * 使item置顶
 * @param {String} id
 * @param {Boolean} is_up
 * @param {Function} callback
 */
exports.topItem=function(id,is_up,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    item.is_up=is_up;
    item.save(callback);
  });
};
/**
 * 使item推荐
 * @param {String} id
 * @param {Boolean} is_hot
 * @param {Function} callback
 */
exports.hotItem=function(id,is_hot,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    item.is_hot=is_hot;
    item.save(callback);
  });
};
/**
 * 更新item信息
 * @param {Object} item
 *    item.item_id,
 *    item.title,
 *    item.author_id,
 *    item.filter,
 *    item.description,
 *    item.phone_number,
 *    item.is_need,
 *    item.handle,
 *    item.price,
 *    item.image_url
 * @param {Function} callback
 */
exports.updateItem=function(item,callback){
  Item.findOne({_id:item_id},function(err,_item){
    _item.title=item.title;
    _item.author_id=item.author_id;
    _item.filter=item.filter;
    _item.description=item.description;
    _item.phone_number=item.phone_number;
    _item.is_need=item.is_need;
    _item.handle=item.handle;
    _item.price=item.price;
    if(!item.is_need){
      _item.image_url=item.image_url;
    }
    _item.save(callback);
  });
};
/**
 * 改变物品状态（false审核中、true审核通过）
 * 由false改为true
 * @param {String} id
 * @param {Function} callback
 */
exports.changeItemStatus=function(id,callback){
  Item.findOne({_id:id},function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(new Error('没有找到该物品或服务'));
    }
    item.item_status=true;
    item.save(callback);
  });
};

/**
 * 自定义查找单个item
 * 通过item.content和item.author_id查找
 * @param content 内容
 * @param author_id 发布者
 */
exports.getItemByQuery = function(query,callback){
  query.deleted = false;
  Item.findOne(query,function(err,item){
    if(err){
      return callback(err);
    }
    if(!item){
      return callback(null,[]);
    }
    return callback(null,item);
  });
};

/**
 * 自定义查找items
 */
exports.getItemsByQuery = function(query,opt,callback){
  query.deleted = false;
  Item.find(query,'',opt,function(err,items){
    if(err){
      return callback(err);
    }
    return callback(null,items);
  });
};
/**
 * 通过user_id查找用户已发布item
 */
exports.getItemByAuthor_id = function(author_id,callback){
  Item.find({author_id:author_id,deleted:false},function(err,item){
    if(err){
      callback(err);
    }
    if(!item){
      return callback(null,[]);
    }
    return callback(null,item);
  });
};

