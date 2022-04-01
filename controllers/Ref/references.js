const formidable = require('formidable')
const _= require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/dbErrorHandler')
const Product = require('../models/product')

exports.productById = (req,res,next,id) =>{
    Product.findById(id).exec((err,product) =>{
        if(err || !product) {
            return res.status(400).json({
                error: " Le produit n'existe pas"
            })    
        }
        req.product = product
        next()
    })
}

exports.read = (req,res) =>{
    req.product.photo = undefined
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
            //on va envoyer le message seulement
            // product,
            message: "vous avez supprimée avec succès le produit"
        })
    })
}


exports.create = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"L'image n'est pas téléverser"
            })
        }
        // // Tester si tout les champs existent
        const {name,description,price,undercategory,shipping} = fields
        if(!name || !description || !price || !undercategory || !shipping){
            return res.status(400).json({
                error:"Veuillez completer tout les champs SVP !" 
            })
        }
        let product = new Product(fields)
        //1kb == 1000
        //1mb == 1000000
        if(files.photo || files.slider1 || files.slider2 || files.slider3){
            if(files.photo.size>1000000){
                return res.status(400).json({
                  error:"L'image doit être en dessous de 2mb ou 1mb=='1000000'"
            })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type

            product.slider1.data = fs.readFileSync(files.slider1.path)
            product.slider1.contentType = files.slider1.type

            product.slider2.data = fs.readFileSync(files.slider2.path)
            product.slider2.contentType = files.slider2.type

            product.slider3.data = fs.readFileSync(files.slider3.path)
            product.slider3.contentType = files.slider3.type
        }
        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json({result})
        })
    })
}


exports.update = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files) =>{
        if(err) {
            return res.status(400).json({
                error: "L'image n'est pas télécharger"
            })
        }
        //check for all fields
        const {name,description,price,undercategory,shipping} = fields
        if(!name || !description || !price || !undercategory || !shipping) {
            return res.status(400).json({
                error: "Tous les champs sont recommandés"
            })
        }
        let product = req.product
        product = _.extend(product, fields)
        if(files.photo){
            // console.log('Files PHOTO',files.photo)
            // 1kb = 1000
            // 1mb = 1000000
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    error: "La taille d'image doit être en dessous de 2mb ou égale a 1mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        product.save((err,product) =>{
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(product)
        })
    })
}




/*
    *sell / arrival
    * by sell = /products?sortBy=sold&order=desc&limit=4
    * by arrival = /products?sortBy=createdAt&order=desc&limit=4
    * if no params are sent, then all products are returned
 */
exports.list = (req,res) =>{
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 4

    Product.find()
        .select("-photo")
        .populate({
            path: "category",
            populate: {
               path: "undercategory"
            }
        })
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,product) =>{
            if(err) {
                return res.status(400).json({
                    error: "Le produit n'existe pas"
                })
            }
            res.json(product)
        })
}

/*
    *it will find the products based on the req product category (souscategory)
    * other products that has the same category ,will be returned
    * ne: not encluded
 */
exports.listRelated = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 4
    Product.find({_id: {$ne: req.product},undercategory: req.product.undercategory})
        .limit(limit)
        .populate('undercategory','_id name')
        .exec((err,product) =>{
            if(err) {
                return res.status(400).json({
                    error: "Le produit n'existe pas"
                })
            }
            res.json(product)
        })
}

exports.listUnderCategories = (req,res) =>{
    Product.distinct("undercategory", {}, (err,product) =>{
        if(err) {
            return res.status(400).json({
                error: "le produit n'existe pas"
            })
        }
        res.json(product)
    })
}


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
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
                // gte -  greater than price [0-10]
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

    Product.find(findArgs)
        .select("-photo")
        .populate({
            path: "category", 
            populate: {
               path: "undercategory" // in blogs, populate comments
            }
         })
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Il n'y a pas de Produits"
                });
            }
            res.json({
                size: product.length,
                product
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










