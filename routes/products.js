const express = require('express');

const productsRepository = require('../Repositories/products');

const productsIndexTemplate = require('../views/products/index');

const router = express.Router();

router.get ('/',async(req,res) => {
    const products = await productsRepository.getAll();
    res.send(productsIndexTemplate({products}));
});

module.exports = router;