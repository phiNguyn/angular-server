// ket noi collection category trong mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;         
const ObjectId = Schema.ObjectId
const categorySchema = new Schema({
    img :{type: String, required: false},
    name: {type: String, required: true},
    home : {type: Number, required: false},
    stt : {type: Number, required: false},
    mota: {type: String, required: false},
    content : {type: String, required: false}
   
})
module.exports = mongoose.models.category || mongoose.model('category',categorySchema)

