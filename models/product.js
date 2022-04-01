const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const ProductSchema = new mongoose.Schema({
name:{
    type: String,
    trim: true,
    required: true,

},
undercategory: {
    type: ObjectId,
    ref: 'UnderCategory', //reference sur categorie
    required: true,
},
yearOfConstruction: {  
    type: Number,
    trim: true,
    required: true,
},
statusOfHouse: {
    type: String,
    trim: true,
    required: true,
},
area: {
    type: Number,
    trim: true,
    required: true,
},
numberOfPiece: {
    type: Number,
    trim: true,
    required: true,
},
toilette: {
    type: String,
    trim: true,
    required: true,
},
watterAndElectric: {
    type: String,
    trim: true,
    required: true,
},
apartment: {
    type: String,
    trim: true,
    required: true,
},
cuisine: {
    type: String,
    trim: true,
    required: true,
},
typeOfPavement: {
    type: String,
    trim: true,
    required: true,
},
price: {
    type: Number,
    trim: true,
    required: true,
},
advance: {
    type: String,
    trim: true,
    // required: true,
}, 
typeOfProduct: {
    type: String,
    trim: true,
    required: true,
},
address: {
    type: String,
    trim: true,
    required: true,
},
description: {
    type: String,
    trim: true,
    required: true,
},
views: {
    type: Number,
    trim: true,
},
photo: {
    data: Buffer,
    contentType: String
},
slide1: {
    data: Buffer, 
    contentType: String
}, slide2: {
    data: Buffer,
    contentType: String
},slide3: {
    data: Buffer,
    contentType: String
},
userinfo:{ 
    type: ObjectId,
    ref: 'Users', //reference sur categorie
    required: true,
}
},{ timestamps: true })

module.exports = mongoose.model('ProductImmobilier',ProductSchema)