const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const salt = +process.env.salt;
const nodemailer = require("nodemailer");
const { UserModel } = require("../models/user.model");


exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const userexists = await UserModel.findOne({email})

    if (userexists) {
      return res
        .status(409)
        .send({ message: "User already exists , Please Login" });
    }

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ Error: err });
      } else {
        const user = await new UserModel({
          name,
          email,
          password: hash,
          
        });
        user.save();
       console.log(user._id)
        
      

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.pass
  }
});

const mailOptions = {
  from: 'anuj22rawat20@gmail.com',
  to: email,
  subject: 'Verification of email',
  text:   `Hello ${name},
  Please verify your email by clicking on this link - http://localhost:8080/user/verify/${user._id}`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
 console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    // do something useful
  }
});
        res.status(201).send({ message: "User registered sucessfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ message: "User dosen't exists, Please Signup" });
    }else if(user.verified === false){
       
       return res.status(401).send({message : "Please verifiy your email"})
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).send({ Error: err });
        }

        if (result) {
          const UserId = user._id;
          const name = user.name;
          const token = jwt.sign(
            { UserId, name, email },
            process.env.Tokensecret,
            { expiresIn: 60 * 60 * 24 * 7 }
          );
          res.cookie("token", token);
          res.status(201).send({ message: "Login Sucessful", token });
        } else {
          res
            .status(401)
            .send({ message: "Incorrect credentials , Please login again" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Something went wrong" });
  }
};




exports.verify = async (req, res) => {
  try{
    const {id} = req.params;
    console.log(id)
    
    const user = await UserModel.findByIdAndUpdate(id,{verified : true})
    
    res.redirect("http://127.0.0.1:5500/frontend/login.html")
  }catch(err){
    console.log(err)
    res.status(500).send({Error : "Something went wrong"})
  }
};