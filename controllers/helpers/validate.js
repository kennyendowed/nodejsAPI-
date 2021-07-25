const Joi=require('@hapi/joi');

//Register validation
const registerValidation= (data) =>{
    const schema =Joi.object({
        name: Joi.string().min(6).required(),
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).email().required(),
        phone: Joi.number().required(),
        birthyear: Joi.number().integer().min(1970).max(2013), 
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
        email: Joi.string().min(6).email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password').min(6).max(15).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),       
    });
   
       return schema.validate(data);
}





module.exports.registerValidation= registerValidation;
module.exports.loginValidation= loginValidation;