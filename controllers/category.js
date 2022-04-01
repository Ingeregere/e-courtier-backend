const formidable = require('formidable')
const _= require('lodash')
const fs = require('fs')
const Category = require('../models/category')
const { errorHandler } = require('../helpers/dbErrorHandler')

// exports.create = (req, res) =>{
//     const category = new Category(req.body)
//     category.save((err, category) => {
//         if(err) {
//             return res.status(400).json({
//                 error: errorHandler(err)  
//             })
//         }
//         res.json({
//             category
//         })
//     })
// }

exports.categoryById = (req,res,next,id) =>{
    Category.findById(id).exec((err,category) =>{
        if(err || !category){
            return res.status(400).json({
                error: "La catégorie non trouvé"
            })
        }
        req.category = category 
        next()
    })
}

//
exports.create = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"L'image n'est pas téléversée"
            })
        }
        // // Tester si tout les champs existent
        const {name} = fields
        if(!name){
            return res.status(400).json({
                error:"Veuillez completer tout les champs SVP !" 
            })
        }
        let category = new Category(fields)
        //1kb == 1000
        //1mb == 1000000
        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({
                  error:"L'image doit être en dessous de 2mb ou 1mb=='1000000'"
            })
            }
            category.photo.data = fs.readFileSync(files.photo.path)
            category.photo.contentType = files.photo.type
        }
        category.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                }) 
            }
            res.json({result})
        })
    })
}
//
exports.update = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"L'image n'est pas téléversée"
            })
        }
        let category = req.category
        category = _.extend(category,fields)
        //1kb == 1000
        //1mb == 1000000
        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({
                  error:"La taille d'image doit être en dessous de 2mb ou 1mb=='1000000'"
            })
            }
            category.photo.data = fs.readFileSync(files.photo.path)
            category.photo.contentType = files.photo.type
        }
        category.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json({result})
        })
    })
} 

exports.read = (req,res) => {
    req.category.photo = undefined
    return res.json(req.category)
}

// exports.update = (req,res) =>{
//    const category = req.category
//     category.name = req.body.name
//     category.save((err, category) =>{
//         if(err) {
//             return res.status(400).json({
//                 error: errorHandler(err)
//             })
//         }
//         res.json(category)
//     })
// }

exports.remove = (req,res) =>{
    const category = req.category
    category.remove((err, category) =>{
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: "La catégorie est supprimée"
        })
    })
}
/*{$and:[{"status":{$eq:"active"}},{"name":{$eq:"Immobilier"}}]}*/ 
exports.list = (req,res) =>{ 
    // req.category.photo = undefined
   Category.find({"status":{$eq:"active"}}).exec((err,category) => {
       if(err) {
           return res.status(400).json({
               error: "Il n'y a pas des données"
           })
       }
       
       res.json(category)
   })
}
exports.listDeleted = (req,res) =>{
    // req.category.photo = undefined
   Category.find({"status":{$eq:"deleted"}}).exec((err,category) => {
       if(err) {
           return res.status(400).json({
               error: errorHandler(err)
           })
       }

       res.json(category)
   })
}

//
exports.photo = (req,res,next) =>{
    if(req.category.photo.data){
        res.set('Content-Type',req.category.photo.contentType)
        return res.send(req.category.photo.data)
    }
    next()  
} 

exports.activeCategory = (req,res)=>{
    const id = req.params.id 
    Category.updateOne(
        { _id: id },
        { $set: { "status": "active" } },
        (err,category)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(category)

        }
     )
}

exports.deletedCategory = (req,res)=>{
    const id = req.params.id 
    Category.updateOne(
        { _id: id },
        { $set: { "status": "deleted" } },
        (err,category)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(category)

        }
     )
}