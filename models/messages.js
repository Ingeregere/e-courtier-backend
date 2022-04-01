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
    status: {
        type: String, 
        enum: ['unread','read'], 
        default: 'unread', // sinon il ne peut se connecter. Donc si son statut == active il peut se connecter
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('MessageByUser', MessagesSchema)
