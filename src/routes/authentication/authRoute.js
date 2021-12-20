const router = require('express').Router();
const { authJwt } = require("../../controllers/middleware");
const users = require("../../controllers/UserController.js");
const { verifyMiddleware } = require("../../controllers/middleware");
const controller = require("../../controllers/AuthController");

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "X-Authorization,Authorization, Origin, Content-Type, Accept"
    );
    next();
  });


 // Create a new user 
 router.post(
    "/signup",
    [
      verifyMiddleware.checkDuplicateUsernameOrEmail,
      verifyMiddleware.checkRolesExisted
    ],
    controller.signup
  );
//Login user
  router.post("/signin",[verifyMiddleware.Verifysignin], controller.signin);
  //verify user account
  router.post("/verify",[verifyMiddleware.VerifyOtp], controller.verify);
    //re-send-otp 
    router.post("/re-send-otp",[verifyMiddleware.VerifyResendOtp], controller.resendEmail);
    //reset-password-link for user account
    router.post("/reset-password-link",[verifyMiddleware.VerifyEmail]);  
    //Logout user
  router.post("/logout", [authJwt.logotToken]);
//Get user details via token
router.get("/me", [authJwt.verifyToken], controller.tokenDetails);











module.exports=router;
