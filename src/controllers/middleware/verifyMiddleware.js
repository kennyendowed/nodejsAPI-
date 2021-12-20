const db = require("../../models");
const utils = require('../helpers/utils');
const {registerValidation,otpValidation,loginValidation,ResendOtpValidation} = require("../helpers/validate");
const ROLES = db.role;
const User = db.user;
var currentDate = new Date();
  var currentDateTime = new Date(currentDate.getTime())
  var datetimedata = currentDateTime
.toLocaleString('en-US', {
  timeZone: 'Africa/Lagos'
});

verifyEmail = (req, res, next) => {
  var currentDate = new Date();
  var currentDateTime = new Date(currentDate.getTime())
  var datetimedata = currentDateTime
.toLocaleString('en-US', {
  timeZone: 'Africa/Lagos'
});
  const { error } = ResendOtpValidation(req.body);

  if(error) return res.status(400).json({
    status :  'FALSE',
    data:[{
      code:  400,
      message: error.details[0].message,
       }]   
  });
 
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(response => {
    if (!response) {
      res.status(404).send({
        status :  'FALSE',
        data:[{
          code:  404,
          message: "Data not found",
           }]       
      });
      return;
    }
var myTIME=response.email_time.toLocaleString('en-US', {
  timeZone: 'Africa/Lagos'
});

       if(myTIME  > datetimedata) {
        res.status(404).send({
          status :  'FALSE',
          data:[{
            code:  404,
            message: " Please Try Again. After " + utils.differhuman(response.email_time),
             }]       
        });
        return;
    } 
      next();
  
  });

}

verifyLogin = (req, res, next) => {
  const { error } = loginValidation(req.body);
  if(error) return res.status(400).json({
    status :  'FALSE',
    data:[{
      code:  400,
      message: error.details[0].message,
       }]   
  });
 
  next();
}
verifyResendOtp = (req, res, next) => {
  var currentDate = new Date();
  var currentDateTime = new Date(currentDate.getTime())
  var datetimedata = currentDateTime
.toLocaleString('en-US', {
  timeZone: 'Africa/Lagos'
});
  const { error } = ResendOtpValidation(req.body);
  if(error) return res.status(400).json({
    status :  'FALSE',
    data:[{
      code:  400,
      message: error.details[0].message,
       }]   
  });

  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(response => {
    if (!response) {
      res.status(404).send({
        status :  'FALSE',
        data:[{
          code:  404,
          message: "Data not found",
           }]       
      });
      return;
    }
var myTIME=response.email_time.toLocaleString('en-US', {
  timeZone: 'Africa/Lagos'
});

       if(myTIME  > datetimedata) {
        res.status(404).send({
          status :  'FALSE',
          data:[{
            code:  404,
            message: " Please Try Again. After " + utils.differhuman(response.email_time),
             }]       
        });
        return;
    } 
      next();
  
  });


}
checkOtp = (req, res, next) => {
  
  const { error } = otpValidation(req.body);
  if(error) return res.status(400).json({
    status :  'FALSE',
    data:[{
      code:  400,
      message: error.details[0].message,
       }]   
  });
  
  User.findOne({
    where: {
      email_code: req.body.code
    }
  }).then(response => {
    if (!response) {
      res.status(404).send({
        status :  'FALSE',
        data:[{
          code:  404,
          message: "Otp Not found please make a new request",
           }]       
      });
      return;
    }

       if(response.email_time  < datetimedata) {
        console.log(currentDateTime)
        res.status(404).send({
          status :  'FALSE',
          data:[{
            code:  404,
            message: "otp expired please make a new request",
             }]       
        });
        return;
    } 
      next();
  
  });

}
checkDuplicateUsernameOrEmail = (req, res, next) => {
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).json({
    status :  'FALSE',
    data:[{
      code:  400,
      message: error.details[0].message,
       }]   
  });
  console.log(error);
//  const userexists = await User.findOne({ where: {username: req.body.username ,email: req.body.email } });
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        status :  'FALSE',
        data:[{
          code:  400,
          message: "Failed! Username is already in use!",
           }]       
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          status :  'FALSE',
          data:[{
            code:  400,
            message: "Failed! Email is already in use!",
             }]
         
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          status :  'FALSE',
          data:[{
            code:  400,
            message: "Failed! Role does not exist = " + req.body.roles[i],
             }]
         
        });
        return;
      }
    }
  }
  
  next();
};

const verifyMiddleware = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  VerifyOtp:checkOtp,
  Verifysignin:verifyLogin,
  VerifyEmail:verifyEmail,
  VerifyResendOtp:verifyResendOtp
};

module.exports = verifyMiddleware;