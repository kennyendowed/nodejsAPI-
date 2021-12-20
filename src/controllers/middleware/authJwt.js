const jwt = require("jsonwebtoken");
const db = require("../../models");
const User = db.user;
const User_Login = db.User_Login;
const Blacklist_Token = db.Blacklist_Token;

verifyToken = (req, res, next) => {
  let token =  req.headers["x-authorization"] || req.headers["authorization"] ;

  if (!token) {
    return res.status(403).send({
      status :  'FALSE',
      data:[{
        code:  403,
        message: "Unauthorized Access - No Token Provided!"
         }]        
    });
  
  }

  Blacklist_Token.findOne({ where: {token: token } })
  .then((found) => {
        
    if (found){
      return res.status(401).send({
        status :  'FALSE',
        data:[{
          code:  401,
          message: "Token blacklisted. Cannot use this token"
           }]        
      });
    }
    else {
      const gtoken = token && token.split(' ')[1];
      jwt.verify(gtoken, process.env.SECRET, (err, decoded) => {     
        if (err) {
          return res.status(401).send({
            status :  'FALSE',
            data:[{
              code:  401,
              message: "Unauthorized Access - Invalid Token Provided!"
               }]        
          });
        }
        req.userId = decoded.id;
        next();
      });
    }
   
  });
 
  try {
    const gtoken = token && token.split(' ')[1];
    jwt.verify(gtoken, process.env.SECRET, async (err, decoded) => {
    const currentUser = await User.findOne({where:{ user_id : decoded.user_id}})
    req.currentUser = currentUser;
    return next();
  });
  } catch (error) {
    console.error(error);
    return res.status(403).send({
      status :  'FALSE',
      data:[{
        code:  403,
        message: "Unauthorized Access - No Token Provided!"
         }]        
    });
  }

};



logotToken = (req, res, next) => {
  let Atoken = req.headers["x-authorization"] || req.headers["authorization"];
  const token = Atoken && Atoken.split(' ')[1];
  if (!token) {
    return res.status(403).send({
      status :  'FALSE',
      data:[{
        code:  403,
        message: "Unauthorized Access - No Token Provided!"
         }]        
    });
  
  }

  Blacklist_Token.findOne({ where: {token: token } })
  .then((found) => {
       
    if (found){
      return res.status(401).send({
        status :  'FALSE',
        data:[{
          code:  401,
          message: "Token blacklisted. Cannot use this token"
           }]        
      });
    }
    else {
 
      jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      //  console.log(err)
      //  console.log(decoded)
        if (err){
          return res.status(403).send({
            status :  'FALSE',
            data:[{
              code:  403,
              message: "Unauthorized Access - No Token Provided!"
               }]        
          });
        }
     
        if(decoded){
          const login = await User_Login.findOne({where:{ user_id : decoded.id}})
          login.logged_out=true;
          login.token_deleted=true;
          await login.save();
           if(login.token_deleted==true){
            const blacklist_token = Blacklist_Token.create({
              token:token
            });
            return res.status(401).send({
              status :  'FALSE',
              data:[{
                code:  401,
                message: "Token blacklisted. Cannot use this token"
                 }]        
            });
          }
        }
        req.user = decoded;
        next();
      });
   
    }
 
  });
 
};


isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isStaff = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
     
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "staff") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Staff Role!"
      });
    });
  });
};

isStaffOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "staff") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Staff or Admin Role!"
      });
    });
  });
};



const authJwt = {
  verifyToken: verifyToken,
  logotToken:logotToken,
  isAdmin: isAdmin,
  isStaff: isStaff,
  isStaffOrAdmin: isStaffOrAdmin
};
module.exports = authJwt;