const formidable = require('formidable')
const _= require('lodash')
const fs = require('fs')
const Products = require('../models/products')
const {errorHandler} = require('../helpers/dbErrorHandler')


exports.productById = (req,res,next,id) =>{
    Products.findById(id)
    .populate('UnderCategory')
    .exec((err,product) =>{
        if(err || !product) {
            return res.status(400).json({
                error: " Le produit n'existe pas" 
            })
        }
        req.product = product 
        next()
    })
}


exports.create = (req,res)=>{
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req,(err,fields,files)=>{
       if(err){
           return res.status(400).json({
              error:"L'image n'est pas televersée"
           })
       }
       //
       const {
        name,
        undercategory, 
        description,
        price,
        address,
        toilette,
        watterAndElectric,
        yearOfConstruction,
        statusOfHouse,
        apartment,
        area,
        cuisine,
        numberOfPiece,
        typeOfPavement,
        advance,
        typeOfProduct
           
       } = fields
             if(
                 !name ||
                 !undercategory ||
                 !description ||
                 !price ||
                 !address ||
                 !toilette||
                 !watterAndElectric||
                 !yearOfConstruction||
                 !statusOfHouse||
                 !apartment||
                 !area|| 
                 !cuisine||
                 !numberOfPiece||
                 !typeOfPavement||
                 !advance|| 
                 !typeOfProduct
             ){
                return res.status(400).json({
                    error:`Tous les champs sont requis` 
                })
             }

       let product = new Products(fields)
       // 1mb = 1000000
       if( files.photo ||
           files.slide1 ||
           files.slide2 ||
           files.slide3){ 
           if(
               files.photo.size > 1000000 ||
               files.slide1.size > 1000000 ||
               files.slide2.size > 1000000 ||
               files.slide3.size > 1000000
           ){
            return res.status(400).json({
                error:"La taille de l'image doit etre inferieure a 1Mo" 
             })
           }

           product.photo.data = fs.readFileSync(files.photo.path)
           product.photo.contentType = files.photo.type

           product.slide1.data = fs.readFileSync(files.slide1.path)
           product.slide1.contentType = files.slide1.type

           product.slide2.data = fs.readFileSync(files.slide2.path)
           product.slide2.contentType = files.slide2.type

           product.slide3.data = fs.readFileSync(files.slide3.path)
           product.slide3.contentType = files.slide3.type

       }
       product.save((err,result)=>{
           if(err){
               return res.status().json({
                   error:errorHandler(err)
               })
           }
           res.json(result)
       })

  })
}

exports.read = (req,res) =>{
    // req.product.photo = undefined
    // req.product.slide1 = undefined
    // req.product.slide2 = undefined
    // req.product.slide3 = undefined
    return res.json(req.product)
}

exports.remove =(req,res) =>{
    let product = req.product
    product.remove((err,product) =>{   
        if(err) {
            return res.status(400).json({
                error: errorHandler(err) 
            })
        }
        res.json({
            message: "vous avez supprimé le produit avec succès"
        })
    })
}


exports.list = (req,res) =>{
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 4

    Products.find()
        .select("-photo")
        .populate({
            path: "souscategory", // populate sousCategorie
            populate: {
               path: "category" // sousCategorie, populate category
            }
         })
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,product) =>{
            if(err) {
                return res.status(400).json({
                    error: 'Produit non trouve'
                })
            }
            res.json(product)
        })
}

exports.update = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
         if(err){
             return res.status(400).json({
                error:"L'image n'est pas televersee" 
             })
         }
         //
         let product = req.product
         product = _.extend(product, fields)
         // 1mb = 1000000
         if(files.photo){
             if(files.photo.size>1000000){
              return res.status(400).json({
                  error:"La taille de l'image doit etre inferieure a 1Mo" 
               })
             }
  
             product.photo.data = fs.readFileSync(files.photo.path)
             product.photo.contentType = files.photo.type
             
            //  product.slide1.data = fs.readFileSync(files.slide1.path)
            //  product.slide1.contentType = files.slide1.type


         }
         product.save((err,result)=>{
             if(err){
                 return res.status().json({
                     error:errorHandler(err)
                 })
             }
             res.json(result)
         })
  
    })
}


exports.listRelated = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 2
    Products.find({_id: {$ne: req.product},undercategory: req.product.undercategory})
        .limit(limit)
        .populate('UnderCategory','_id nameUnderCategory')
        .exec((err,product) =>{
            if(err) {
                return res.status(400).json({
                    error: 'Produit non trouve'
                })
            }
            res.json(product)
        })
}

exports.listUnderCategories = (req,res) =>{
    Products.distinct("undercategory", {}, (err,product) =>{
        if(err) {
            return res.status(400).json({
                error: 'Produit non trouve'
            })
        }
        res.json(product)
    })
}


exports.listBySearchProduct = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price for example =>[0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Products.find(findArgs)
        .select("-photo")
        .populate("undercategory")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Produits non trouve"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};



exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.slide1 = (req,res,next) =>{
    if(req.product.slide1.data){
        res.set('Content-Type',req.product.slide1.contentType)
        return res.send(req.product.slide1.data)
    }
    next()
}
exports.slide2 = (req,res,next) =>{
    if(req.product.slide2.data){
        res.set('Content-Type',req.product.slide2.contentType)
        return res.send(req.product.slide2.data)
    }
    next()
}
exports.slide3 = (req,res,next) =>{
    if(req.product.slide3.data){
        res.set('Content-Type',req.product.slide3.contentType)
        return res.send(req.product.slide3.data)
    }
    next()
}






exports.listSearchProduct = (req,res)=>{
    const query = {}
    //assign search value to query.name
    if(req.query.search){
        query.name = { $regex: req.query.search, $options: 'i' }
 
        if(req.query.undercategory && req.query.undercategory !='All'){
            query.undercategory = req.query.undercategory
        }
 
        Products.find(query,(err,product)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(product)
        }).select("-photo")
    }
 }
  