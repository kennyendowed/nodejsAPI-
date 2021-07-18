const express= require('express');
const cors = require("cors");
const app=express();
const dotenv=require('dotenv');
// const jwt=require('jsonwebtoken');


dotenv.config();

var corsOptions = {
    origin: "http://localhost:8001 "
  };

  app.use(cors(corsOptions));



// Import Routes
const authRoute=require('./routes/auth');

//Middlewares
app.use(express.json());

//Route Middlewares
app.use('/api/auth',authRoute);

const db = require("./models");
const Role = db.role;

// **********NOTE***********
// initial() function helps us to create 3 rows in database.
// In development, you may need to drop existing tables and re-sync database. So you can use force: true as code above.

// For production, just insert these rows manually and use sync() without parameters to avoid dropping data:
//db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

function initial() {
  Role.create({
    id: 1,
    name: "admin",
    is_permission:1
  });
 
  Role.create({
    id: 2,
    name: "staff",
    is_permission:2
  });
 
  Role.create({
    id: 3,
    name: "user",
    is_permission:3
  });
}


    // set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



