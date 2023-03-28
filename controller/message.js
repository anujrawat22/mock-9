const { MessageModel } = require("../models/message.model")


exports.get = async (req,res)=>{
    try{
      const messages = await MessageModel.find().sort({createdat : -1})
      res.status(200).send({message : "All messages" , messages})
    }catch(err){
        console.log(err)
        res.status(500).send({Error : "Something went wrong"})
    }
}

exports.postmessage = async(req,res)=>{
    try{
     const {message,UserId,name} = req.body;
     const new_message = await new MessageModel({message, user_id : UserId,user_name : name})
     new_message.save()
     res.status(200).send({message : "Message stored sucessfully"})
    }catch(err){
        console.log(err)
        res.status(500).send({Error : "Something went wrong"})
    }
}