const express = require('express');

const {validationResult} = require('express-validator');

const userRepository = require('../../Repositories/users');

const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const {requireEmail,
       requirePassword,
       requirePasswordConfirmation,
       requireEmailExist,
       requireValidPasswordForUser} = require('./validators');

const router = express.Router();

router.get('/signup',(req,res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup',[requireEmail,requirePassword,requirePasswordConfirmation], async (req,res)=>{
     
    const errors = validationResult(req);
     
     if(!errors.isEmpty()){
        return res.send(signupTemplate({ req, errors }));
     }

    const{email,password} = req.body;
    const user = await userRepository.create({email,password});
    
    req.session.userId = user.id;

    res.send(`Account Created`);
});

router.get('/signout', (req,res)=>{
    req.session = null;
    res.send('sign out');
});

router.get('/signin',(req,res) => {
    res.send(signinTemplate({}));
});

router.post('/signin',[ requireEmailExist, requireValidPasswordForUser],async (req,res)=>{

    const errors = validationResult(req);
   
    if(!errors.isEmpty()){
        return res.send(signinTemplate({errors}));
    }

    const{email}= req.body;

    const existingUser = await userRepository.getOnBy({email});

    req.session.userId = existingUser.id;

    res.send('User Loggined ...');
});

module.exports = router;