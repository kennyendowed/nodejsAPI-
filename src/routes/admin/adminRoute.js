const router = require('express').Router();
const { authJwt } = require("../../controllers/middleware");
const controller = require("../../controllers/UserController");

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "X-Authorization,Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  //  default route
router.get("/",(req,res)=>{
    res.json({
        message:"Welcome to Api Engine application.",
    });
});



// router.get(
//   "admin",
//   [authJwt.verifyToken, authJwt.isAdmin],
//   controller.adminBoard
// );



module.exports=router;