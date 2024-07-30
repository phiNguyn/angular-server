const mongoose = require('mongoose')
const Schema = mongoose.Schema
const orderID = Schema.ObjectId
const productID = Schema.ObjectId



const orderItemSchema = new Schema({
    order_id: {type: orderID, required: true},
    product_id: {type: productID, required: true},
    quantity: {type: Number, required: true},
    unit_price: {type: Number, required: true},
    total_price: {type: Number, required: true}
})

module.exports = mongoose.models.orderItem ||  mongoose.model('orderItem',orderItemSchema)