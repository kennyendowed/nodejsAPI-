const utils = require('./helpers/utils');
const crypto = require("crypto");
const algorithm = "aes-128-cbc"; 
const Securitykey="zAL7X5AVRm8l4Ifs";
const initVector ="BE/s3V0HtpPsE+1x";


async function allAccess (req, res)  {
  res.status(200).json({
    status :  'TRUE',
    data:[{
      code:  200,
      data: "Welcome to Nodejs Api Engine Application.......",
       }]
      })    

};



async function encrypt(req, res){
  
  // generate 16 bytes of random data
  //const initVector = crypto.randomBytes(16);
  // console.log(req.body)
  // console.log(JSON.stringify(req.body))
  // protected data
  const message =JSON.stringify(req.body);// '{ firstname="akin", lastname="ade", mobile="08034743719", DOB=DateTime.Now, Gender="M", CURRENCYCODE="NGN",  ChannelID=1, ProductID=2 }';
  
  console.log(message)
  // secret key generate 32 bytes of random data
 // const Securitykey = crypto.randomBytes(32);
  
  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  
  // encrypt the message
  // input encoding
  // output encoding
 
  let encryptedData = cipher.update(message, "utf-8", "hex");
  
  encryptedData += cipher.final("hex");
  
  console.log("Encrypted message: " + encryptedData);

  res.status(200).json({
    status :  'TRUE',
    data:[{
      code:  200,
      data: "Encrypted message: " + encryptedData,
       }]
      })  

  };

async function dencrypt(req, res) {
 // console.log(req.body.data);
  let encryptedData =req.body.data; //'7132d28831af9920c557a842d689e99febccbf459d709c3c5c4efeb037bb69109505d80c6cfc58bcd8338149375e59c5de2755bf50b2c18c91c26a78759b1688910dbd89309729c13db03481f4c2f4e575bdc04a78018f0845817a151ad95d8a25305ad642ff30ab9513d52164bdcb3f12b46883502c665e19b2912d1172a63ed098d51887d0d8930e2aa7d851afc439ff687f427ad2d392828d96963a27a311bbab1cf2fc71dc4c6a5b2a5b880bc445c6c1e4d07a8665716495131496b7ae34'
// the decipher function
const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

decryptedData += decipher.final("utf8");

console.log("Decrypted message: " + decryptedData);
res.status(200).json({
  status :  'TRUE',
  data:[{
    code:  200,
    data: "Decrypted message: " + decryptedData,
     }]
    })  
}











module.exports={
  allAccess,encrypt,dencrypt
}


// const User = require("../models/User");

// // Create and Save a new User
// exports.create = (req, res) => {
//    // Validate request
//    if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   // Create a Customer
//   const user = new User({
//     email: req.body.email,
//     name: req.body.name,
//     active: req.body.active
//   });

//   // Save Customer in the database
//   Customer.create(customer, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Customer."
//       });
//     else res.send(data);
//   });
// };

// // Retrieve all Users from the database.
// exports.findAll = (req, res) => {
  
// };

// // Find a single User with a UserId
// exports.findOne = (req, res) => {
  
// };

// // Update a User identified by the UserId in the request
// exports.update = (req, res) => {
  
// };

// // Delete a User with the specified UserId in the request
// exports.delete = (req, res) => {
  
// };

// // Delete all Users from the database.
// exports.deleteAll = (req, res) => {
  
// };