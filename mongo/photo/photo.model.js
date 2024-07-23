const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const photoSchema = new Schema({
    nameImage: {type: String, required: true},
    productId: {type :Schema.ObjectId, required: true}
})

module.exports = mongoose.models.photo || mongoose.model('photo',photoSchema)