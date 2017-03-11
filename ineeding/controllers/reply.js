var validator = require("validator");
var Message = require("../common/message");
var EventProxy = require("eventproxy");
var User = require("../proxys").User;
var Item = require("../proxys").Item;
var Reply = require("../proxys").Reply;
var config = require("../config");

/**
 * 创建回复
 *
 * content-type: 表单
 * req.params.item_id,req.session.user_id,req.body.content
 */
exports.create = function(req, res, next) {
	var item = req.params.tiem_id;
	var user = req.session.user_id;
	var content = req.body.content;
	var str = validator.trim(String(content));
	if (tre === "") {
		return res.render("notify/notify", {
			message: "不能回复空的消息。"
		});
		// TODO 跳转页面
	}
	var ep = new EventProxy();
	ep.fail(next);
	Item.getItem(item_id, ep.doneLater(function(item) {
		if (!item || item.deleted || item.blocked) {
			ep.unbind();
			return res.render("notify/notify", {
				message: "此消息不存在或已不能回复。"
			});
		}
		ep.emitLater("item", item);
	}));

	ep.all("item", function(item) {
		User.getUserById(item.author_id, ep.done("item_author"));
	});

	ep.all("item", "item_author", function(item, itemAuthor) {
		Reply.saveReply(content, item_id, req.session.user._id, ep.done(function(reply) {
			ep.emitLater("reply_saved", reply);
			Message.sendMessageToMentionUsers(itemAuthor._id, user._id, item._id, reply._id, function() {
				ep.emitLater("message_saved");
			});
		}));

		item.reply_count += 1;
		item.last_reply_at = Date().now();
		item.save();
		User.getUserById(req.session.user._id,function(user) {
			user.experence += 1;
			user.reply_count += 1;
			user.save();
			req.session.user = user;
		});
		ep.emit("update");
	});
	ep.all("reply_saved", "message_saved", "update", function(reply) {
		res.render("",null);
	});
	// TODO 页面跳转
};

/**
 * 删除回复
 *
 * req.params.item_id;
 * req.body.reply_id;
 */
exports.delete = function(req, res, next) {
	var reply_id=req.body.reply_id;
	Reply.getReplyAllById(reply_id,function(reply){
		reply.deleted=true;
		reply.save();
		
		reply.author.reply_count-=1;
		reply.experence-=1;
		reply.author.save();
		
		reply.item.reply_count-=1;
		reply.item.last_reply_at=Date().now();
		reply.item.save();
		
		res.render("",null);
		//TODO 页面跳转
	});
};

