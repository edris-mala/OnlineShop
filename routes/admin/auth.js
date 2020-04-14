const express = require('express');
const {handleErrors} = require('./middlewares');

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

router.post('/signup',
    [requireEmail,requirePassword,requirePasswordConfirmation],
    handleErrors(signinTemplate),
    async (req,res)=>{

    const{email,password} = req.body;
    const user = await userRepository.create({email,password});
    
    req.session.userId = user.id;

    res.redirect('/admin/products');
});

router.get('/signout', (req,res)=>{
    req.session = null;
    res.send('sign out');
});

router.get('/signin',(req,res) => {
    res.send(signinTemplate({}));
});

router.post('/signin',
    [ requireEmailExist, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async (req,res)=>{
 
    const{email}= req.body;

    const existingUser = await userRepository.getOnBy({email});

    req.session.userId = existingUser.id;

    res.redirect('/admin/products');
});

module.exports = router;