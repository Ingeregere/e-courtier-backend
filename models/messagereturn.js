const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const MessageReturnSchema = new mongoose.Schema({
    messager: {
        type: String,
        trim: true,
        default:"Bonjour ! Merci de nous avoir contactés, mais si vous souhaitez en savoir un peu plus sur ce produit, merci de nous contacter sur ces numéros : -Portable +25769227171, Whatsapp +25772415986",
        required: true,
    },
    users: {
        type: ObjectId,
        ref: 'Users', //reference sur categorie
    },
    status: {
        type: String, 
        enum: ['unread','read'], 
        default: 'unread', // sinon il ne peut se connecter. Donc si son statut == active il peut se connecter
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('MessageReturn', MessageReturnSchema)
