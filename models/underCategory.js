const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const UnderCategorySchema = new mongoose.Schema({
    nameUnderCategory: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    category: {
        type: ObjectId,
        ref: 'Category', //reference sur categorie
        required: true,
    },

    photo: {
        data: Buffer,
        contentType: String
    }, 
    status: {
        type: String, 
        enum: ['active','deleted','blocked'],
        default: 'active', // sinon il ne peut se connecter. Donc si son statut == active il peut se connecter
        required: true
    }


}, { timestamps: true })

module.exports = mongoose.model('UnderCategory', UnderCategorySchema)
