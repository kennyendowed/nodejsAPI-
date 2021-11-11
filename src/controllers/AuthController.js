const db = require("../models");
var customId = require("custom-id");
const nodemailer = require('nodemailer');
const utils = require('./helpers/utils');
const sendMail = require('./helpers/mailSend');
const User_Login = db.User_Login;
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.signup = (req, res) => {
  // generate token and save
  var token =utils.token(4,'numeric'); 
 var minutesToAdd=5;
 var currentDate = new Date();

var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000 )
var datetimedata = futureDate
// .toLocaleString('en-US', {
//   timeZone: 'Africa/Lagos'
// });
// console.log(utils.formatDate(datetimedata))

// console.log(utils.formatTime(datetimedata))

  var token =utils.randomPin(4); 
  // Save User to Database
  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    email_time:datetimedata,
    email_code:token,
    email_verify: 0,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles);
          //.then(() => {
            // res.status(201).send({ 
            //   status :  'TRUE',
            //   data:[{
            //     code:  201,
            //     data: "User was registered successfully!",
            //      }] });
          //});
        });
      } else {
        // user role = 3
        user.setRoles([3]);
        //.then(() => {
          // res.status(201).send({ 
          //   status :  'TRUE',
          //   data:[{
          //     code:  201,
          //     data: "User was registered successfully!",
          //      }]
          //      });
        //});
      }

     var  text= 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' +req.body.email + '\/' + token + '\n\nThank You!\n' ;
    sendMail('index',req.body.name , req.body.email,'Account Verification Link', text, function(err, data) {
       
      if (err) {
        console.log('Email sent\n', err)
        return res.status(500).send({
          status :  'FALSE',
          data:[{
            code:  500,
            message: err.message || "Technical Issue!, Please click on resend for verify your Email."
             }]        
        });
       
      }
      console.log('Email sent\n', data)
        res.status(200).send({ 
            status :  'TRUE',
            data:[{
              code:  200,
              data: 'A verification email has been sent to ' + req.body.email+ '. It will be expire after one day. If you not get verification Email click on resend token',
               }]
               });
  });

    })
    .catch(err => {
      res.status(400).send({ 
        status :  'FALSE',
        data:[{
          code:  400,
          message: err.message 
           }]   

       });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where:{
      [Op.or]: [
        { username: req.body.username },
        { email:req.body.username}
      ]
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          status :  'FALSE',
          data:[{
            code:  404,
            message: "User Not found.",
             }]

          });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          status :  'FALSE',
          data:[{
            code:  401,
            message: "Invalid Password!",
             }]        
        });
      }
      var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
      req.connection.remoteAddress || 
      req.socket.remoteAddress || 
      req.connection.socket.remoteAddress

      const token_secret= customId({
        token_secret : ip,
        date : Date.now(),
        randomLength: 8 
      });
      const token_id = customId({
        user_id: user.id,
        date: Date.now(),
        randomLength: 4
      });

      var mail_val = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username
      }; 

      var token = jwt.sign(mail_val, process.env.SECRET, {
        expiresIn: 86400 // 24 hours
      });
       User_Login.create({
        user_id :  user.id,
        token_id : token_id,
        token_secret : token_secret ,
        ip_address : ip ,
        device : req.headers["user-agent"]
      });
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token,
          roles: authorities
        });
      });
    })
    .catch(err => {
      res.status(400).send({ 
        status :  'FALSE',
        data:[{
          code:  400,
          message: err.message 
           }]   

       });
    });
};

exports.tokenDetails = (req, res) => {
  let token = req.headers["x-authorization"] || req.headers["authorization"];
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status :  'FALSE',
        data:[{
          code:  401,
          message: "Unauthorized Access - Invalid Token Provided!"
           }]        
      });
    }
    res.status(200).send({ 
      status :  'TRUE',
      data:{
        code:  200,
        data: {
          "id": decoded.id,
          "email": decoded.email,
          "name":decoded.name,
          "username": decoded.username,
          "iat": new Date(decoded.iat * 1000),
          "exp": new Date(decoded.exp* 1000)
        }
         }
         });
    // req.userId = decoded.id;
    // next();
  });
};