const Joi=require('@hapi/joi');
const customJoi = Joi.extend(require("joi-age"));


//Register validation
const registerValidation= (data) =>{
    const schema =Joi.object({
        name: Joi.string().min(6).trim(true).required(),
        username: Joi.string().min(6).trim(true).required(),
        email: Joi.string().min(6).email().trim(true).required(),
        phone: Joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number").required(),
        birthyear: customJoi.date().minAge(18).required(), 
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password').min(6).max(15).required(),
        // .messages({
        //     "string.base": " should be a type of string",
        //     "string.empty": " must contain value",
        //     "string.pattern.base": " must contain at least 1 lower-case and capital letter, a number and symbol",
        //     "any.required": " is a required field"
        // }),
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
        password: Joi.string().min(8).required(),
    });
   
       return schema.validate(data);
}





module.exports.registerValidation= registerValidation;
module.exports.loginValidation= loginValidation;