const Joi=require('@hapi/joi');
const customJoi = Joi.extend(require("joi-age"));


//Register validation
const registerValidation= (data) =>{
 const date18YearsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18);
// try to validate the age larger than or equal to 18 years old

    const schema =Joi.object({
      first_name: Joi.string().min(3).required(),
      last_name: Joi.string().min(3).required(),
      gender: Joi.string().min(1).required(),
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).email().required(),
        phone: Joi.number().required(),
      // dob: Joi.date().max(date18YearsAgo),
        dob: customJoi.date().minAge(18),
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
};

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
};

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
};

//saveToken Validation
const saveTokenValidation =(data)=>{
  const schema =Joi.object({
    DeviceToken: Joi.string().required(),     
});

   return schema.validate(data);
};

//ResendOtp Validation
const ResendOtpValidation =(data)=>{
  const schema =Joi.object({
    email: Joi.string().min(6).email().required(),     
});

   return schema.validate(data);
};

//password rest Validation
const passwordResetValidation =(data)=>{
  const schema =Joi.object({
    token: Joi.string().min(4).required(),   
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
};

//wallet creation verify
const walletInputValidation = (data) => {
  const schema =Joi.object({
    narrations: Joi.string().min(3).required(),
    amount: Joi.number().required(),
    transactionReference: Joi.string().min(1).required(),
      date: Joi.string().required(),
 
  });
 
     return schema.validate(data);
};
//beneficiary Validation
const beneficiaryValidation = (data) => {
  const schema =Joi.object({
    name: Joi.string().min(3).required(),
    number: Joi.number().min(10).required(),
 
  });
 
     return schema.validate(data);
}



module.exports={
  beneficiaryValidation,walletInputValidation,saveTokenValidation,registerValidation,loginValidation,otpValidation,ResendOtpValidation,passwordResetValidation
};
