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

function randomPin(length){
    var a = Math.floor(100000 + Math.random() * 900000);   
    a = String(a);
  return  a = a.substring(0,length);
   
}

 module.exports = { token, randomPin};