const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, 
        required: true,  
        unique: 32 
    }, 
    photo:{
        data:Buffer,
        contentType:String 
    },
    status: {
        type: String,
        enum: ['active','deleted','blocked'],
        default: 'active', 
        required: true
    }
},{timestamps: true})



module.exports = mongoose.model('Category',CategorySchema)
