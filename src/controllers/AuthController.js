const db = require("../models");
var customId = require("custom-id");
const nodemailer = require("nodemailer");
const utils = require("./helpers/utils");
const sendMail = require("./helpers/mailSend");
const User_Login = db.User_Login;
const User = db.user;
const Role = db.role;
const Wallet = db.Wallet;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


async function verify(req, res) {
  try {

    User.findOne({
      where: {
        [Op.or]: [{ email_code: req.body.code }],
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            status: "FALSE",
            data: [
              {
                code: 404,
                message: "Verification code not found.",
              },
            ],
          });
        }

        user.update({
          email_verify : '1',
          email_code: utils.randomPin(4),
        })

    res.status(200).send({
      status: "TRUE",
      data: [
        {
          code: 200,
          data: "verification successfully ",
        },
      ],
    });
  });
  } catch (err) {
    res.status(400).send({
      status: "FALSE",
      data: [
        {
          code: 400,
          message: err.message,
        },
      ],
    });
  }
}

async function signup(req, res) {
  var ip =
(req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
req.connection.remoteAddress ||
req.socket.remoteAddress ||
req.connection.socket.remoteAddress;
  //exports.signup = async  (req, res) => {
  // generate token and save
  //var token =utils.token(4,'numeric');
  var userID = utils.randomPin(8);
  var token = utils.randomPin(4);
  // Save User to Database
  User.create({
    user_id: userID,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    dob: req.body.dob,
    username: req.body.username,
    email: req.body.email,
    email_time: utils.addMinutes(),
    email_code: token,
    password: bcrypt.hashSync(req.body.password, 8),
    ip_address : ip,
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles);       
        });
      } else {
        // user role = 3
        user.setRoles([3]);
      }
  // Save User Wallet to Database
  Wallet.upsert({
    user_id: userID,
    account_type: 'Teir 1',
    account_name: req.body.first_name +' '+ req.body.last_name,
    account_number:  utils.randomPin(10),
    actual_bal: '0.00',
    lien_bal: '0.00',
  })
     
  values = {
    email: req.body.email,
    name: req.body.name,
  };
  let title = "Account Verification Token";
  let message =
    "\n\n Hello " +
    req.body.first_name +' '+ req.body.last_name +
    ",\n\n Welcome you to Demand Supply  as we hope to serve you better. \n\n OTP : " +
    token +
    "  \n\n";
 sendVerificationEmail(token, values, res, title, message);

    })
    .catch((err) => {
      res.status(400).send({
        status: "FALSE",
        data: [
          {
            code: 400,
            message: err.message,
          },
        ],
      });
    });

}

async function resetPassword(req, res) {
  User.findOne({
    where: {
      resetPasswordToken: req.body.token,
    },
  }).then((user) => {
    let setTime = utils.addMinutes();
    var token = utils.randomPin(4);
    user.update({
      resetPasswordExpires: setTime,
      resetPasswordToken: token,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    values = {
      email: user.email,
      name: user.name,
    };
    let title = "Reset Password Notification";
    let message =
      "\n\n Hello " +
      user.name +
      ", \n\n You are receiving this email because you just changed your account  password .  \n\nIf you did not request a password reset, please try to reset your password again  and also change the password to your personal email.  ";
    sendVerificationEmail(token, values, res, title, message);
    res.status(200).send({
      status: "TRUE",
      data: [
        {
          code: 200,
          data: "Password has been changed ",
        },
      ],
    });
  });
}

async function signin(req, res) {
  var ip =
  (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;

  User.findOne({
    where: {
      [Op.or]: [{ username: req.body.email }, { email: req.body.email }],
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "User Not found.",
            },
          ],
        });
      }
      if(user.ip_address !== ip)
      {
        user.update({
          ip_address : ip
        })
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          status: "FALSE",
          data: [
            {
              code: 401,
              message: "Invalid Password!",
            },
          ],
        });
      }
     

      const token_secret = customId({
        token_secret: ip,
        date: Date.now(),
        randomLength: 8,
      });
      const token_id = customId({
        user_id: user.id,
        date: Date.now(),
        randomLength: 4,
      });

      var mail_val = {
        id: user.id,
        userId: user.user_id,
        email: user.email,
        name: user.first_name +' '+ user.last_name,
        username: user.username,
        email_verify: user.email_verify,
      };

      var token = jwt.sign(mail_val, process.env.SECRET, {
        expiresIn: 86400, // 24 hours
      });
      User_Login.create({
        user_id: user.user_id,
        token_id: token_id,
        token_secret: token_secret,
        ip_address: ip,
        device: req.headers["user-agent"],
      });
      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token,
          roles: authorities,
        });
      });
    })
    .catch((err) => {
      res.status(400).send({
        status: "FALSE",
        data: [
          {
            code: 400,
            message: err.message,
          },
        ],
      });
    });
}

async function saveToken(req, res) {
  var UserId = req.currentUser.user_id;
  //console.log(UserId)
  try {
    User.findOne({
      where: {
        user_id: UserId,
      },
    }).then((user) => {
      user.update({
        device_token: req.body.DeviceToken,
      });
      return res.status(200).send({
        status: "TRUE",
        data: [
          {
            code: 200,
            data: "Device Token saved successfully ",
          },
        ],
      });
    });
  
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function tokenDetails(req, res) {
  // exports.tokenDetails = (req, res) => {
  let token = req.headers["x-authorization"] || req.headers["authorization"];
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status: "FALSE",
        data: [
          {
            code: 401,
            message: "Unauthorized Access - Invalid Token Provided!",
          },
        ],
      });
    }
    currentDateTime = new Date(decoded.exp * 1000);
    var datetimedata = currentDateTime.toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
    });

    res.status(200).send({
      status: "TRUE",
      data: {
        code: 200,
        data: {
          userId: parseInt(decoded.userId),
          email: decoded.email,
          name: decoded.name,
          username: decoded.username,
          email_verification:
            decoded.email_verify === 0 ? "unverify" : "verify",
          // "iat": new Date(decoded.iat * 1000),
          token_exp: datetimedata,
        },
      },
    });
    // req.userId = decoded.id;
    // next();
  });
}
async function resendEmail(req, res) {
  let values = {};
  var token = utils.randomPin(4);
  User.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }],
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        status: "FALSE",
        data: [
          {
            code: 404,
            message: "User Not found.",
          },
        ],
      });
    } else {
      user.update({
        email_time: utils.addMinutes(),
        email_code: token,
      });
    }
    values = {
      email: req.body.email,
      name: user.name,
    };
    let title = "Account Verification Token";
    let message =
      "\n\n Hello " +
      user.name +
      ",\n\n Welcome you to Demand Supply  as we hope to serve you better. \n\n OTP : " +
      token +
      "  \n\n";
    sendVerificationEmail(token, values, res, title, message);
  });
}

async function resetPassowrdLink(req, res) {
  let values = {};
  var token = utils.randomPin(4);
  User.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }],
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        status: "FALSE",
        data: [
          {
            code: 404,
            message:
              req.body.email +
              " account is not register with us please check email again or create a new account",
          },
        ],
      });
    } else {
      let setTime = utils.addMinutes();
      user.update({
        email_time: setTime,
        resetPasswordExpires: setTime,
        resetPasswordToken: token,
      });
    }
    values = {
      email: req.body.email,
      name: user.name,
    };
    let title = "Reset Password Link";
    let message =
      "\n\n Hello " +
      user.name +
      ", \n\n You are receiving this email because we received a password reset request for your account.  \n\nEmail :  " +
      req.body.email +
      ",\n\nReset Password code " +
      token +
      "\n\n If you did not request a password reset, no further action is required. ";
    sendVerificationEmail(token, values, res, title, message);
  });
}

async function sendVerificationEmail(token, req, res, title, message) {
  try {
    let template = "index";
    let subject = title;
    let url = req.headers ? req.headers.host : process.env.APP_URL;
    let name = req.body ? req.body.name : req.name;
    let to = req.body ? req.body.email : req.email;
    let from = process.env.MAIL_FROM_ADDRESS;
    let link =
      "<a href='http://" + url + "/api/auth/verify/" + token + "'>link</a> ";
    let code = token;

    //    `\n\nHi ${req.body.name }\n\n<br>\n\nPlease click on the following <a href="${link}">link</a> to verify your account.</p>
    //  <br>\n\nIf you did not request this, please ignore this email.</p>`;
    //'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \n' + link + '\n\nThank You!\n' ;

    await sendMail(template, name, to, from, subject, message);
    res.status(200).send({
      status: "TRUE",
      data: [
        {
          code: 200,
          data:
            "A verification email has been sent to " +
            to +
            ". It will be expire after one day. If you not get verification Email click on resend token",
        },
      ],
    });
  } catch (err) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message:
            err.message ||
            "Technical Issue!, Please click on resend for verify your Email.",
        },
      ],
    });
  }
}

module.exports = {
  saveToken,
  verify,
  tokenDetails,
  signup,
  signin,
  resendEmail,
  resetPassowrdLink,
  resetPassword,
};
