// ket noi collection category trong mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId



const orderSchema = new Schema({

    user_id: {type: ObjectId, ref:'users' , required: true},
    total_amount: {type: Number, required: true},
    order_date: {type: Date, required: true, default: Date.now },
    name: {type : String, required: false},
    email: {type : String, required : false},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    type_payment: {type: Number, required: true},
    order_status : {type : Number, required: true}

})


module.exports = mongoose.models.order || mongoose.model('order',orderSchema)
