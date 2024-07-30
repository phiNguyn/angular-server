var userModel  = require('./user.model')
const orderModel = require('./order.model')
const orderItemModel = require('./orderItem/orderItem.model')
const productModel = require('./product.model')
module.exports = {newOrder ,getOrderAll ,getOrderByUserId, getOrderDetail} 


async function newOrder (body) {
    try {
            const {name, email, phone, user_id, total_amount, address, type_payment, order_status , order_date} = body
                const userFind = await userModel.findById(user_id)
                if(!userFind) {
                    throw new Error("Không tìm thấy Mã User")
                }
                const newOrder = orderModel({
                    user_id:userFind._id, 
                    total_amount, 
                    address, 
                    type_payment, 
                    order_status, 
                    order_date ,
                    name, email, phone,
                })

                const result = await newOrder.save()
                return result

    } catch (error) {
        console.log(error);
    }
}
async function getOrderAll() {
    try {
        const order = await orderModel.find().sort('-_id')
        return order
    } catch (error) {
        console.log(error);
    }
}

async function getOrderByUserId(id) {
    try {
            let userId = await userModel.findById(id)
            if(!userId) {
                throw new Error("User not found")

            }
            const order = await orderModel.find({user_id: userId}).sort('-_id')
            return order
            
    } catch (error) {
        console.log(error);
    }
}

async function getOrderDetail(id) {
    try {
        
        const orderItem = await orderItemModel.find({order_id: id})
        const order = await orderModel.findById(id)
        if(!order && !orderItem) {
            return 
        }
        return {orderItem, order}
    } catch (error) {
        
    }
}

