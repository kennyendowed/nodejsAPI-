const Joi=require('@hapi/joi');

//Register validation
const registerValidation= (data) =>{
    const schema =Joi.object({
        name: Joi.string().min(6).required(),
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).email().required(),
        phone: Joi.number().required(),
        birthyear: Joi.number().integer().min(1970).max(2013), 
        password: Joi.string().uppercase().lowercase().min(3).max(15).required().label('Password'),
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