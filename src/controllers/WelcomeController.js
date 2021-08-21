exports.allAccess = (req, res) => {
      res.status(200).json({
        message:"Welcome to Nodejs Api Engine application.",
        status:  "200"
    });

};




















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