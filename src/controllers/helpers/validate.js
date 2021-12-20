const Joi=require('@hapi/joi');
const customJoi = Joi.extend(require("joi-age"));


//Register validation
const registerValidation= (data) =>{
  //  const date18YearsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18);
// try to validate the age larger than or equal to 18 years old

    const schema =Joi.object({
        name: Joi.string().min(6).required(),
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).email().required(),
        phone: Joi.number().required(),
       // birthyear: Joi.date().max(date18YearsAgo),
        birthyear: customJoi.date().minAge(18),
        // birthyear: Joi.number().integer().min(1970).max(2013), 
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password').min(6).max(15).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),       
        password_confirmation: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .options({ messages: { 'any.only': '{{#label}} does not match'} })
    });
   
       return schema.validate(data);
}

//Login validation
const loginValidation= (data) =>{
    const schema =Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password').min(6).max(15).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),       
    });
   
       return schema.validate(data);
}

//Otp validation
const otpValidation= (data) =>{
  const schema =Joi.object({
      code: Joi.string().required()
      .messages({
      "string.empty": `hello {{#label}} cannot be an empty field`,
      'any.required': 'chief {{#label}} is required',
        }),       
  });
 
     return schema.validate(data);
}


//ResendOtp Validation
const ResendOtpValidation =(data)=>{
  const schema =Joi.object({
    email: Joi.string().min(6).email().required(),     
});

   return schema.validate(data);
}



module.exports={
  registerValidation,loginValidation,otpValidation,ResendOtpValidation
}
// module.exports.registerValidation= registerValidation;
// module.exports.loginValidation= loginValidation;
// module.exports.otpValidation=otpValidation;