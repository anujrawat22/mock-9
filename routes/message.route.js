const express = require("express");
const { get, postmessage } = require("../controller/message");


const MessageRouter = express.Router()

MessageRouter.get("/",get)

MessageRouter.post("/create",postmessage)


module.exports = {MessageRouter}