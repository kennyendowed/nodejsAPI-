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
        message:"Welcome to Staff Api Engine application.",
    });
});


// router.get("/getallstaff", [authJwt.verifyToken, authJwt.isStaff],controller.staffBoard);




module.exports=router;