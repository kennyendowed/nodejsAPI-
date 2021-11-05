const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: process.env.MAIL_DRIVER,
    port:  process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD 
    },
  });
  transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath:  __dirname + '/../../views/mails/'
}));

// const auth = {
//     auth: {
//         api_key: process.env.API_KEY ||  'MAIL_GUN_API_KEY', // TODO: Replace with your mailgun API KEY
//         domain: process.env.DOMAIN || 'MAIL_GUN_DOMAIN' // TODO: Replace with your mailgun DOMAIN
//     }
// };

//const transporter = nodemailer.createTransport(mailGun(auth));


const sendMail = (email, subject, text, cb) => {
    const mailOptions = {
        from:process.env.MAIL_FROM_ADDRESS, // TODO: email sender
      replyTo:process.env.MAIL_REPLY_TO,
      to:  email, // TODO: email receiver
      cc: "kennyendowed@hotmail.com",
      bbc:"kennygendowed@gmail.com",
      subject: subject,
      text: text,
      template: 'index',
      context: {
        name: 'Accime Esterling'
    } // send extra values to template
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
}

module.exports = sendMail;