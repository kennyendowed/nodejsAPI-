const crypto = require('crypto');

function getPool(type)
{
    var pool
    switch (type) {
        case 'alnum':
             pool= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case 'alpha':
             pool= 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            break;
        case 'hexdec':
             pool= '0123456789abcdef';
            break;
        case 'numeric':
             pool= '0123456789';
            break;
        case 'nozero':
             pool= '123456789';
            break;
        case 'distinct':
             pool= '2345679ACDEFHJKLMNPRSTUVWXYZ';
            break;
        default:
             pool= type;
            break;
    }

    return pool;
}

function secureCrypt(min, max)
{
    var a = Math.floor(100000 + Math.random() * 900000);   
    a = String(a);
  return  a = a.substring(0,max);
}

function token(length,type) {
      var token = '';
      var result = '';
      var max   = getPool(type).length;
      for ( var i = 0; i < length; i++ ) {
        result += crypto.randomBytes(length).toString('hex');
        //getPool(type).charAt(Math.floor(Math.random() * max));
    }    

    for ( var i = 0; i < length; i++ ) {
        token += result+[secureCrypt(0, max)];
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
    return  strTime;
  }

  function formatDate(date) {
   // return date.getDate() + "/" + new Intl.DateTimeFormat('en', { month: 'short' }).format(date) + "/" + date.getFullYear() + " " + strTime;
    return date.getDate() + '/' + (date.getMonth()+1) + '/' +  date.getFullYear();
  }

function randomPin(length){
    var a = Math.floor(100000 + Math.random() * 900000);   
    a = String(a);
  return  a = a.substring(0,length);
   
}

 module.exports = {formatDate, formatTime,token, randomPin};