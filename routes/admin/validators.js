const {check} = require('express-validator');

const userRepository = require('../../Repositories/users');

module.exports = {
    requireTitle:check("title")
    .trim()
    .isLength({min:2,max:20})
    .withMessage('Invalid Title'),

    requirePrice:check("price")
    .trim()
    .toFloat()
    .isFloat({min:1})
    .withMessage('Invalid Price'),

    requireEmail:check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be valid Email')
    .custom(async (email)=>{
        const existingUser = await userRepository.getOnBy({email});
        if(existingUser){
            throw new Error('Email in use ...');
        }
    }),
    
    requirePassword:check('password')
    .trim()
    .isLength({min:5})
    .withMessage('Password must be longer 4'),

    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({min:5})
    .withMessage('passwordConfirmation must be match with password')
    .custom((passwordConfirmation,{req}) =>{
        if(passwordConfirmation !== req.body.password){
            throw new Error('Password must be match ...');
        }
    }),

    requireEmailExist:check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email not found!')
    .custom(async(email)=>{
      const existingEmail = await userRepository.getOnBy({email});
      if(!existingEmail){
          throw new Error('Email not found!');
      }
    }),

    requireValidPasswordForUser:check('password')
    .trim()
    .custom(async(password,{req})=>{
        const existingUser = await userRepository.getOnBy({email:req.body.email});
        if(!existingUser){
          throw new Error('Invalid Password');
        }
        const validPassword = await userRepository.comparePassword(
          existingUser.password,
          password
        );
        if(!validPassword){
          throw new Error('Invalid Password');
        }
    })
};