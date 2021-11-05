const express= require('express');
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv=require('dotenv');
const app=express();
dotenv.config();

var corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
  // exposedHeaders: ['Authorization']
  };

  app.use(cors(corsOptions));

 


// Import Routes
const WelcomeRoute=require('./routes/welcomeRoute');
const authRoute=require('./routes/authentication/authRoute');
const UserauthRoute=require('./routes/users/userRoute');
const StaffauthRoute=require('./routes/staff/staffRoute');
const AdminauthRoute=require('./routes/admin/adminRoute');

//Middlewares
app.use(express.json());

//Route Middlewares
app.use('/',WelcomeRoute);
app.use('/api',WelcomeRoute);
app.use('/api/auth',authRoute);
app.use('/api/user',UserauthRoute);
app.use('/api/staff',StaffauthRoute);
app.use('/api/admin',AdminauthRoute);



// const server = http.createServer(app);

// const io = socketIo(server); // < Interesting!



const db = require("./models");
const Role = db.role;

// **********NOTE***********
// initial() function helps us to create 3 rows in database.
// In development, you may need to drop existing tables and re-sync database. So you can use force: true as code above.

// For production, just insert these rows manually and use sync() without parameters to avoid dropping data:
// db.sequelize.sync();
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


// let interval;

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }

//   interval = setInterval(() => getApiAndEmit(socket), 1000);


//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     clearInterval(interval);
//   });
// });

// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };

//     // set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



