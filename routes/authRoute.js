const router = require('express').Router();
const users = require("../controllers/UserController.js");
const { verifySignUp } = require("../controllers/middleware");
const controller = require("../controllers/AuthController");

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "X-Authorization, Origin, Content-Type, Accept"
    );
    next();
  });


 // Create a new user 
 router.post(
    "/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
//Login user
  router.post("/signin", controller.signin);


module.exports=router;
