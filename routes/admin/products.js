const express = require('express');
const {validationResult} = require('express-validator');

const productsRepository = require('../../Repositories/products'); 

const productsNewTemplate = require('../../views/admin/products/new');

const {requireTitle,requirePrice} = require('./validators');

const router = express.Router();

router.get('/admin/products',(req,res)=>{
    
});

router.get('/admin/products/new',(req,res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new',[requireTitle,requirePrice],async(req,res) => {
     
    const errors = validationResult(req);
     
     if(!errors.isEmpty()){
        return res.send(productsNewTemplate({ req, errors }));
     }

    const{title,price} = req.body;
    const product = await productsRepository.create({title,price});

    res.send(`Product Created`);
});

module.exports = router;