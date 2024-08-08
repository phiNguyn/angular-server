// ket noi collection category trong mongodb
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Schema = mongoose.Schema;         
const categorySchema = new Schema({
    img :{type: String, required: false},
    name: {type: String, required: true},
    home : {type: Boolean, required: false},
    stt : {type: Number, required: false},
    mota: {type: String, required: false},
    content : {type: String, required: false},
    slug: {type: String, slug: "name"}
   
})
module.exports = mongoose.models.category || mongoose.model('category',categorySchema)

