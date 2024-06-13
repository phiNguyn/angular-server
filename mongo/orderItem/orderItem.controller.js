const productModel = require('../product.model')
const orderModel = require('../order.model')
const orderItemModel = require('./orderItem.model')
const orderItemController = {

    newOrderItem : async (req,res) => {
        try {
       
        const orderIdFind = await orderModel.findById(req.body.order_id)
        const productIdFind = await productModel.findById(req.body.product_id)
        if(!orderIdFind || !productIdFind) {
            throw new Error("Thiếu id order hoặc id của product")
        }

        const newOrderItem = orderItemModel({
            order_id: orderIdFind._id,
            product_id: productIdFind._id,
            quantity:req.body.quantity,
            unit_price:req.body.unit_price,
            total_price:req.body.total_price
        })

        const result = await newOrderItem.save()
     return res.status(200).json({ result, message: "Yeah" })
        } catch ( error) {
            res.status(500)
        }
    },

    getItemByOrderId : async (req,res) => {
        try {
            const orderId = req.params._id  
            const item = await orderItemModel.find({order_id: orderId})
     return res.status(200).json({ item, message: "Yeah" })

        } catch (error) {
            res.status(500).json(error)
            
        }
    }
    
}
module.exports = orderItemController
