const express = require("express");
const { verify, register, login } = require("../controller/user");

const UserRouter = express.Router();

UserRouter.post("/register",register);

UserRouter.post("/login",login);

UserRouter.get("/verify/:id",verify)

module.exports = { UserRouter };
