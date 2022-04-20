const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const MessagesSchema = new mongoose.Schema({
    messages: {
        type: String,
        trim: true,
        required: true,
    },
    users: {
        type: ObjectId,
        ref: 'Users', //reference sur categorie
    },
    product: {
        type: ObjectId,
        ref: 'Product', //reference sur categorie
    },
}, { timestamps: true })

module.exports = mongoose.model('MessageByUser', MessagesSchema)
