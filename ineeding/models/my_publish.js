var mongoose = require('mongoose');
var BaseModel = require('./base_model');//用于扩展
var ObjectId = Schema.ObjectId;

var My_publishSchema = new Schema({



});

My_publishSchema.plugin(BaseModel);
My_publishSchema.index({create_at:-1});
mongoose.model('My_publishSchema',My_publishSchema);          //compile
