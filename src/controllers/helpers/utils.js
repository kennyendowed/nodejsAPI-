const crypto = require('crypto');
const sendMail = require("./mailSend");

function differhuman(date) {
  let diffTime = Math.abs(new Date().valueOf() - new Date(date).valueOf());
  let days = diffTime / (24*60*60*1000);
  let hours = (days % 1) * 24;
  let minutes = (hours % 1) * 60;
  let secs = (minutes % 1) * 60;
  [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]
  
  //console.log(days+'d', hours+'h', minutes+'m', secs+'s');

  // // Make a fuzzy time
  // var delta = Math.round((+new Date - date) / 1000);

  // var minute = 60,
  //   hour = minute * 60,
  //   day = hour * 24,
  //   week = day * 7;

 var fuzzy;
 if(days !=0 && hours !=0 && minutes !=0 && secs !=0)
 {
  fuzzy = [days+'d' , hours+'h' , minutes+'m' , secs+'s'];
 }
 else if(minutes > 0)
 {
  fuzzy = [ minutes+' minute' ];
 }
 else if(secs > 0)
 {
  fuzzy = [ secs+' seconds' ];
 }

  // console.log(date)
  // console.log(delta)
  // if (delta < 30) {
  //   fuzzy = 'just then.';
  // } else if (delta < minute) {
  //   fuzzy = delta + ' seconds ago.';
  // } else if (delta < 2 * minute) {
  //   fuzzy = 'a minute ago.'
  // } else if (delta < hour) {
  //   fuzzy = Math.floor(delta / minute) + ' minutes ago.';
  // } else if (Math.floor(delta / hour) == 1) {
  //   fuzzy = '1 hour ago.'
  // } else if (delta < day) {
  //   fuzzy = Math.floor(delta / hour) + ' hours ago.';
  // } else if (delta < day * 2) {
  //   fuzzy = 'yesterday';
  // }
return fuzzy;
}


function addMinutes(minutesToAdd= 5)
{
  
  var currentDate = new Date();
 
 var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000 )
 var datetimedata = futureDate
 .toLocaleString('en-US', {
   timeZone: 'Africa/Lagos'
 });
 return datetimedata;
}


function getPool(type) {
  var pool
  switch (type) {
    case 'alnum':
      pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;
    case 'alpha':
      pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      break;
    case 'hexdec':
      pool = '0123456789abcdef';
      break;
    case 'numeric':
      pool = '0123456789';
      break;
    case 'nozero':
      pool = '123456789';
      break;
    case 'distinct':
      pool = '2345679ACDEFHJKLMNPRSTUVWXYZ';
      break;
    default:
      pool = type;
      break;
  }

  return pool;
}

function secureCrypt(min, max) {
  var a = Math.floor(100000 + Math.random() * 900000);
  a = String(a);
  return a = a.substring(0, max);
}

function token(length, type) {
  var token = '';
  var result = '';
  var max = getPool(type).length;
  for (var i = 0; i < length; i++) {
    result += crypto.randomBytes(length).toString('hex');
    //getPool(type).charAt(Math.floor(Math.random() * max));
  }

  for (var i = 0; i < length; i++) {
    token += result + [secureCrypt(0, max)];
    // token +=crypto.randomBytes(length).toString('hex');
  }

  return token;
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour "0" should be "12"
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function formatDate(date) {
  // return date.getDate() + "/" + new Intl.DateTimeFormat('en', { month: 'short' }).format(date) + "/" + date.getFullYear() + " " + strTime;
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

function randomPin(length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));

}

function randomChar (length,type)
{
  var result           = '';
  var characters       = getPool(type);
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

 function sendsEMail(email, uname,  title, message) {
  try {
    let template = "index";
    let subject = title;
    let url =  process.env.APP_URL;
    let name = uname;
    let to = email;
    let from = process.env.MAIL_FROM_ADDRESS;
     sendMail(template, name, to, from, subject, message);
    // res.status(200).send({
    //   status: "TRUE",
    
    // });
  } catch (err) {
    console.log(err)
    return false;
    // return JSON.parse({
    //   status: "FALSE",
    //   data: [
    //     {
    //       code: 500,
    //       message:
    //         err.message ||
    //         "Technical Issue!, Please click on resend for verify your Email.",
    //     },
    //   ],
    // });
    
  }
}

module.exports = {sendsEMail, formatDate,randomChar, formatTime, token, randomPin ,differhuman ,addMinutes};