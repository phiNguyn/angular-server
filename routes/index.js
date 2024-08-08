var express = require('express');
const productModel = require('../mongo/product.model');
const orderModel = require('../mongo/order.model');
const userModel = require('../mongo/user.model');
var router = express.Router();

router.get('/', (req, res) => {

    res.status(200).send("HELLO")
})

router.get('/ecommerce',  async(req,res) => {
    try {
        const allProducts = await productModel.countDocuments()
        const allOrders = await orderModel.countDocuments({order_status: 1})
        const allUsers = await userModel.countDocuments()
        return res.json({allProducts,allOrders,allUsers})
    } catch (error) {
        
    }
})


module.exports = router;
