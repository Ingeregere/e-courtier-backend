const formidable = require('formidable')
const _= require('lodash')
const fs = require('fs')
const Product = require('../models/productsf')
const {errorHandler} = require('../helpers/dbErrorHandler')
// const { result } = require('lodash')

exports.productById = (req,res,next,id) =>{
    Product.findById(id) 
    .populate('UnderCategory')
    .exec((err,product) =>{
        if(err || !product) {
            return res.status(400).json({
                error: " Le produit n'existe pas ! verifiez bien SVP"
            })
        }
        req.product = product 
        next()
    })
}

exports.listp = (req,res)=>{
    Product.find().exec((err,product)=>{
     if(err){
     return res.status(403).json({
         error:"Aucun produit trouvé"
     })
     }
     res.json(product)
    })
}