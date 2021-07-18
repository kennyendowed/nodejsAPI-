const jwt = require("jsonwebtoken");
const db = require("../../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["X-Authorization"];

  if (!token) {
    return res.status(403).send({
      message: "Unauthorized Access - No Token Provided!"
    });
  }

  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized Access - Invalid Token Provided!"
      });
    }
    req.userId = decoded.id;
    next();
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
  isAdmin: isAdmin,
  isStaff: isStaff,
  isStaffOrAdmin: isStaffOrAdmin
};
module.exports = authJwt;