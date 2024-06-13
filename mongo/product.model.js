// ket noi collection category trong mongodb
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId
const productSchema = new Schema({
    name: {type: String, required: true},
    material :{type: String, required: true},
    img : {type: String, required: true},
    price : {type: Number, required: true},
    view : {type: Number, required: false},
    bestseller: {type: Boolean, required: false},
    quantity: {type: Number, required: true},
    slug : {type: String, slug: "name" },

    category: {
        type: {
            categoryId:{type: ObjectId, required:true},
            categoryName: {type: String,required:true},
        } ,
        required: true
    }
})
module.exports = mongoose.models.product || mongoose.model('product',productSchema)
