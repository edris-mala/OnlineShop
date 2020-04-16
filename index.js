const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const productsRouter = require('./routes/products');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const cartsRouter = require('./routes/carts');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({ keys:[''] }));

app.use(productsRouter);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(cartsRouter);


app.listen(3001,()=>{
    console.log('listening');
});