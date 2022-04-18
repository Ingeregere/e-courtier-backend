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

exports.addProduct = (req,res)=>{
    let form = new formidable.IncomingForm()
        form.keepExtensions = true  
        form.parse(req,(err,fields,files)=>{
             if(err){
                   return res.status(400).json({
                   error:"Image n'est pas televersee ! Merci bien"
                })
            }  

 const { name,
         undercategory,
         yearOfConstruction,
         statusOfHouse,
         area,
         numberOfPiece,
         bathroom,
         bathroomNumber,
         watterAndElectric,
         apartment,
         cuisine,
         typeOfPavement,
         price,
         advance,
         typeOfProduct,
         province,
         municipality,
         district,
         description,
         userinfo,
        } = fields
    if(!name){
        return  res.status(400).json({ 
        error:`Le champ nom de produit est requis`
        })
    }if(!undercategory){
        return  res.status(400).json({ 
        error:`Le champ catégorie de produit est requis`
        })
    }if(!statusOfHouse){  
        return  res.status(400).json({ 
        error:`Le champ statut de produit est requis`
        })
    }if(!area){
        return  res.status(400).json({ 
        error:`Le champ Surface de produit est requis`   
        })
    }if(!typeOfProduct){
        return  res.status(400).json({ 
        error:`Le champ type de produit est requis`
        })
    }if(!province){
        return  res.status(400).json({ 
        error:`Le champ province est requis`
        })
    }if(!municipality){
        return  res.status(400).json({ 
        error:`Le champ commune est requis`
        })
    }if(!district){
        return  res.status(400).json({ 
        error:`Le champ quartier est requis`
        })
    }if(!description){
        return res.status(400).json({
            error:`Le champ description de produit est requis`
        })
    }
    if(!userinfo){
        return res.status(400).json({
            error:`Le champ les informations d'utilisateur sont requis`
        })
    }
  
      let product = new Product(fields)
       // 1mb = 1000000
       if( files.photo || files.slide1 || files.slide2 || files.slide3){ 
           if(
               files.photo.size > 1000000 ||
               files.slide1.size > 1000000 ||
               files.slide2.size > 1000000 ||
               files.slide3.size > 1000000
           ){
            return res.status(400).json({
                error:"La taille de l'image doit etre inférieure a 1Mo" 
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
                 return res.status(400).json({
                     error:errorHandler(err)
                 })
             }

             res.json(result)
        })
  })
}

exports.readProduct = (req,res)=>{ 
    req.product.slide1 = undefined 
    req.product.slide2 = undefined 
    req.product.slide3 = undefined  
    return res.json(req.product) 
}

 
exports.list = (req,res) =>{
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 4
    //slide1
    Product.find({$and:[{"status":{$eq:"active"}},{"posted":{$eq:"published"}}]})
        .select("-slide1")
        .select("-slide2")
        .select("-slide3")
        .populate({
            path: "undercategory", 
            populate: {
               path: "category" 
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

//
exports.listRelated = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 100
    Product.find({$and:[{"status":{$eq:"active"}},{"posted":{$eq:"published"}},{_id: {$ne: req.product},undercategory: req.product.undercategory}]})
        .select("-slide1")
        .select("-slide2")
        .select("-slide3")
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
    Product.distinct("undercategory", {}, (err,product) =>{
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

    Product.find(findArgs)
        .select("-slide1")
        .select("-slide2")
        .select("-slide3")
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
 
        Product.find(query,(err,product)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(product)
        })
        .select("-slide1")
        .select("-slide2")
        .select("-slide3")
    }
 }

 //
 exports.postedProduct = (req,res)=>{
    const id = req.params.id 
    Product.updateOne(
        { _id: id },
        { $set: { "posted": "published" } },
        (err,product)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(product)

        }
     )
}

exports.activeProduct = (req,res)=>{
    const id = req.params.id 
    Product.updateOne(
        { _id: id },
        { $set: {"status": "active"}},
        (err,product)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(product)

        }
     )
}

exports.deletedProduct = (req,res)=>{
    const id = req.params.id 
    Product.updateOne(
        { _id: id },
        {$set:{"status": "deleted","posted":"unposted"}},
        (err,product)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(product)

        }
     )
}

/*All select cond*/
exports.listProductUnposted = (req,res) =>{ 
   Product.find({$and:[{"status":{$eq:"active"}},{"posted":{$eq:"unposted"}}]})
          .exec((err,product) => {
       if(err) {
           return res.status(400).json({
               error: "Il n'y a pas des données"
           })
       }
       
       res.json(product)
   })
}

 exports.listProductDel = (req,res) =>{ 
    Product.find({"status":{$eq:"deleted"}})
           .exec((err,category) => {
        if(err) {
            return res.status(400).json({
                error: "Il n'y a pas des données"
            })
        }
        
        res.json(category)
    })
 }
 
 //Find product by id under category
 exports.listAllProductByIdUnderCategory=(req,res)=>{
  const Id = req.params.Id
  Product.find({"undercategory":{$eq:Id}})
         .exec((err,product)=>{
             if(err){
               return res.status(400).json({
                 error: "Le produit est introuvable"

               }) 
             }
             res.json(product)
         })
 }

 //viewProduct
 exports.viewProduct = (req,res)=>{
    const id = req.params.id 
    Product.updateOne(
        { _id: id },
        { $set: {"views": views+1}},
        (err,product)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            } 
            res.json(product)

        }
     )
}