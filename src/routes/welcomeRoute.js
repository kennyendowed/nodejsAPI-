const router = require('express').Router();
const { authJwt } = require("../controllers/middleware");
const controller = require("../controllers/WelcomeController");

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "X-Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

router.get("/", controller.allAccess);




module.exports=router;