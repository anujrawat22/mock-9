const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  message : {type : String},
  user_id : {type : mongoose.Schema.Types.ObjectId, ref : "user"},
  user_name : {type : String},
  createdat : {type : Date,default : Date.now()}
});

const MessageModel = mongoose.model("message", MessageSchema);

module.exports = { MessageModel };