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
    // required: true,
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
    // required: true,
},
bathroom: {
    type: String,
    trim: true,
    // required: true,
},
bathroomNumber: {
    type: Number,
    trim: true,
    // required: true,
},
watterAndElectric: {
    type: String,
    trim: true,
    // required: true,
},
apartment: {
    type: String,
    trim: true,
    // required: true,
},
cuisine: {
    type: String,
    trim: true,
    // required: true,
},
typeOfPavement: {
    type: String,
    trim: true,
    // required: true,
},
price: {
    type: Number,
    trim: true,
    required: true,
},
advance: {
    type: String,
    trim: true,
}, 
typeOfProduct: {
    type: String,
    trim: true,
    required: true,
},
province: {
    type: String,
    trim: true,
    required: true,
},
municipality: {
    type: String,
    trim: true,
    required: true,
},
district: {
    type: String,
    trim: true,
    required: true,
},
description: {
    type: String,
    trim: true,
    required: true,
},
documentTPO: {
    type: String,
    trim: true,
    // required: true,
},
photo: {
    data: Buffer,
    contentType: String
},
slide1: {
    data: Buffer, 
    contentType: String
}, 
slide2: {
    data: Buffer,
    contentType: String
},
slide3: {
    data: Buffer,
    contentType: String
},
userinfo:{ 
    type: ObjectId,
    ref: 'Users', //reference sur categorie
    required: true,
},
posted: {
    type: String,
    enum: ['published','unposted'], 
    default: 'unposted', // sinon si role == ADMIN  sinon PROPS
    required: true
},
status: {
    type: String, 
    enum: ['active','deleted','location','buy'],
    default: 'active', // sinon il ne peut se connecter. Donc si son statut == active il peut se connecter
    required: true
},
views: {
    type: Number,
    trim: true, 
    default:0
},
},{ timestamps: true })

module.exports = mongoose.model('ProductImmobilier',ProductSchema)