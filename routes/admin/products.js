const express = require('express');
const multer = require('multer');

const {handleErrors,requireAuth} = require('./middlewares');
const productsRepository = require('../../Repositories/products'); 

const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const {requireTitle,requirePrice} = require('./validators');

const router = express.Router();
const upload = multer({storage:multer.memoryStorage()});

router.get('/admin/products',requireAuth,async(req,res)=>{
    const products = await productsRepository.getAll();
    res.send(productsIndexTemplate({products}));
});

router.get('/admin/products/new',requireAuth,(req,res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new',
    requireAuth, 
    upload.single('image'),
    [requireTitle,requirePrice],
    handleErrors(productsNewTemplate),
    async(req,res) => {
        const image = req.file.buffer.toString('base64');
        const{title,price} = req.body;
        await productsRepository.create({title,price,image});

        res.redirect('/admin/products');
});

router.get('/admin/products/:id/edit',requireAuth,async(req,res)=>{
    const product = await productsRepository.getOn(req.params.id);
    if(!product){
       return res.send(`Product Not Found`);
    }

    res.send(productsEditTemplate({product}));
});

router.post('/admin/products/:id/edit',
    requireAuth,
    upload.single('image'),
    [requireTitle,requirePrice],
    handleErrors(productsEditTemplate,async (req) =>{
        const product = await productsRepository.getOn(req.params.id);
        return {product};
    }),
    async(req,res)=>{
        const changes = req.body;

        if(req.file){
            changes.image = req.file.buffer.toString('base64');
        }

        try{
            await productsRepository.update(req.params.id,changes);
        }
        catch(err){
            res.send('Could not find item');
        }

        res.redirect('/admin/products');
});

module.exports = router;