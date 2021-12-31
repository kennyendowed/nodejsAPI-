const router = require('express').Router();
const { verifyMiddleware } = require("../../controllers/middleware");
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


// Get request 
router.get("/userProfile",[authJwt.verifyToken], controller.userProfile);
router.get("/wallet",[authJwt.verifyToken], controller.userWallet);
router.get("/getuserTransaction/:id",[authJwt.verifyToken], controller.getuserTransaction);
router.get("/list-beneficiary",[authJwt.verifyToken], controller.getbeneficiary);
router.get("/all-offers",[authJwt.verifyToken], controller.listOffer);
router.get("/get-wishlist-reserved-history",[authJwt.verifyToken], controller.listOfferwishlist);
router.delete("/delete-beneficiary/:id",[authJwt.verifyToken], controller.deletebeneficiary);


//POST REQUEST
router.put("/userUpdate/:id",[authJwt.verifyToken], controller.userUpdate);
router.post("/fundWallet/:id",[authJwt.verifyToken,verifyMiddleware.VerifywalletInput], controller.funduserWallet);
router.post("/offer",[authJwt.verifyToken], controller.createOffer);
router.post("/reservation/:id",[authJwt.verifyToken], controller.createReservation);
router.post("/confirmWatchlist/:id",[authJwt.verifyToken], controller.createWatchlist);
router.post("/add-beneficiary",[authJwt.verifyToken,verifyMiddleware.VerifybeneficiaryInput], controller.createbeneficiary);



module.exports=router;