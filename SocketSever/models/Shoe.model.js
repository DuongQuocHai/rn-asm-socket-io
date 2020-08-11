const mongoose = require('mongoose');

const ShoesSchema = mongoose.Schema({
    name: {  type: String, required: true },
    images: { type: String },
    price: { type: Number , required: true},
    price_promotion: { type: Number  },
    description: { type: String },
})
module.exports = mongoose.model('shoes', ShoesSchema)