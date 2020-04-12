const express = require('express');

const homePageTemplate = require('../views/main/index');

const router = express.Router();

router.get ('/',(req,res) => {
    res.send(homePageTemplate());
});

module.exports = router;