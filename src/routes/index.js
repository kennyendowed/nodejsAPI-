// Import Routes
const WelcomeRoute=require('./welcomeRoute');
const authRoute=require('./authentication/authRoute');
const UserauthRoute=require('./users/userRoute');
const StaffauthRoute=require('./staff/staffRoute');
const AdminauthRoute=require('./admin/adminRoute');

module.exports = app => {
    
  //Route Middlewares
app.use('/',WelcomeRoute);
app.use('/api',WelcomeRoute);
app.use('/api/auth',authRoute);
app.use('/api/user',UserauthRoute);
app.use('/api/staff',StaffauthRoute);
app.use('/api/admin',AdminauthRoute);

app.use((req,res,next) =>{
const error =new Error('Not found');
error.status= 404;
next(error);
});

app.use((error,req,res,next) => {
res.status(error.status || 500);
res.json({
  error:{
    message:error.message
  }
})
});

};