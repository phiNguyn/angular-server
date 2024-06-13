// ket noi collection category trong mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {type: String, required: true},
    email :{type: String, required: true},
    pass : {type: String, required: true},
    address: {type: String, required: false},
    phone: {type: String, required: false},
    role : {type: Number, required: false}
})
module.exports = mongoose.models.user || mongoose.model('user',userSchema)
