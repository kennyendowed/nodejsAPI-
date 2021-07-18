const router = require('express').Router();
const users = require("../controllers/UserController.js");



 // Create a new user
 router.post("/register", users.create);
 
router.get("/",(req,res)=>{
    res.json({
        message:"Welcome to Api Engine application.",
    });
});

router.post("/login",(req,res)=>{
    res.json({
        message:"hello login",
    });
});


module.exports=router;
